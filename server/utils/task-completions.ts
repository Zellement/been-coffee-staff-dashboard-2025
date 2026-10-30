import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

/**
 * Task completions live in Supabase (`task_completions`) rather than on the
 * Contentful entries, so completing a task costs no Management API calls.
 *
 * To keep every card, store and form unchanged, Contentful responses for
 * completable entries get the latest Supabase completion laid over their
 * `lastCompleted` / `completedBy` fields. Where Supabase has nothing yet the
 * value already in Contentful is kept, so older completions still show.
 *
 * The leaderboard's `taskHistory` is built from Supabase alone.
 */

const COMPLETABLE_CONTENT_TYPES = ['taskInstance', 'setDayTask', 'singleTask']

// The leaderboard shows the current pay period only, which starts at most
// around six weeks back, so older minutes are never needed
const LEADERBOARD_LOOKBACK_DAYS = 62

type LatestCompletion = {
    entry_id: string
    completed_at: string
    completed_by: string | null
}

type MinutesCompletion = {
    employee_id: string
    completed_at: string
    task_name: string | null
    minutes: number
    location_id: string | null
}

type ContentfulResponse = {
    items?: Array<{ sys?: { id?: string }; fields?: Record<string, any> }>
    total?: number
}

const isNewer = (candidate: string, current: unknown): boolean => {
    if (!current) return true
    const currentTime = Date.parse(String(current))
    return Number.isNaN(currentTime) || Date.parse(candidate) > currentTime
}

async function applyCompletions(
    event: H3Event,
    contentType: string,
    params: Record<string, unknown>,
    data: ContentfulResponse
): Promise<ContentfulResponse> {
    const items = data.items ?? []
    const ids = items
        .map((item): string | undefined => item.sys?.id)
        .filter((id): id is string => !!id)
    if (!ids.length) return data

    const supabase = await serverSupabaseClient(event)
    const { data: rows, error } = await supabase
        .from('latest_task_completions')
        .select('entry_id, completed_at, completed_by')
        .in('entry_id', ids)

    if (error) throw error

    const latest = new Map<string, LatestCompletion>(
        (rows as LatestCompletion[]).map(
            (row: LatestCompletion): [string, LatestCompletion] => [
                row.entry_id,
                row
            ]
        )
    )

    const merged = items.map((item) => {
        const completion = item.sys?.id ? latest.get(item.sys.id) : undefined
        if (
            !completion ||
            !isNewer(completion.completed_at, item.fields?.lastCompleted)
        )
            return item

        return {
            ...item,
            fields: {
                ...item.fields,
                lastCompleted: completion.completed_at,
                completedBy: completion.completed_by ?? item.fields?.completedBy
            }
        }
    })

    // Single tasks are one-offs, queried with `lastCompleted[exists]=false`.
    // Contentful can't see Supabase completions, so drop those here too
    if (
        contentType === 'singleTask' &&
        String(params['fields.lastCompleted[exists]']) === 'false'
    ) {
        const open = merged.filter(
            (item): boolean => !latest.has(item.sys?.id ?? '')
        )
        return {
            ...data,
            items: open,
            total: (data.total ?? merged.length) - (merged.length - open.length)
        }
    }

    return { ...data, items: merged }
}

async function applyLeaderboardMinutes(
    event: H3Event,
    data: ContentfulResponse
): Promise<ContentfulResponse> {
    const items = data.items ?? []
    const ids = items
        .map((item): string | undefined => item.sys?.id)
        .filter((id): id is string => !!id)
    if (!ids.length) return data

    const since = new Date(
        Date.now() - LEADERBOARD_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    const supabase = await serverSupabaseClient(event)
    const { data: rows, error } = await supabase
        .from('task_completions')
        .select('employee_id, completed_at, task_name, minutes, location_id')
        .in('employee_id', ids)
        .gt('minutes', 0)
        .gte('completed_at', since)

    if (error) throw error

    const byEmployee = new Map<string, TaskWithMinutes[]>()
    for (const row of rows as MinutesCompletion[]) {
        const tasks = byEmployee.get(row.employee_id) ?? []
        tasks.push({
            date: row.completed_at,
            taskName: row.task_name || 'Unknown Task',
            timeInMinutes: row.minutes,
            location: row.location_id || ''
        })
        byEmployee.set(row.employee_id, tasks)
    }

    return {
        ...data,
        items: items.map((item) => {
            const tasks = (item.sys?.id && byEmployee.get(item.sys.id)) || []

            // Built from Supabase alone; the Contentful field is no longer
            // written, and its copy of this period was moved over
            return {
                ...item,
                fields: {
                    ...item.fields,
                    taskHistory: {
                        tasksWithMinutes: tasks,
                        totalOfAllTimeInMinutes: tasks.reduce(
                            (sum: number, task: TaskWithMinutes): number =>
                                sum + task.timeInMinutes,
                            0
                        )
                    }
                }
            }
        })
    }
}

/**
 * Lay Supabase task completions over a Contentful Delivery response, where
 * the query is one that shows them. Any other response is returned as is.
 * Never throws: if Supabase is unavailable the Contentful data is returned.
 */
export async function withTaskCompletions<T>(
    event: H3Event,
    params: Record<string, unknown>,
    data: T
): Promise<T> {
    const contentType = params.content_type
    if (typeof contentType !== 'string') return data

    try {
        if (COMPLETABLE_CONTENT_TYPES.includes(contentType))
            return (await applyCompletions(
                event,
                contentType,
                params,
                data as ContentfulResponse
            )) as T

        // Only the leaderboard selects taskHistory
        if (
            contentType === 'employee' &&
            String(params.select ?? '').includes('fields.taskHistory')
        )
            return (await applyLeaderboardMinutes(
                event,
                data as ContentfulResponse
            )) as T
    } catch (err) {
        console.warn('[task-completions] overlay failed', err)
    }

    return data
}
