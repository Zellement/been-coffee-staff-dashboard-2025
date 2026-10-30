import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { requireUser } from '../../utils/require-user'

type CompleteBody = {
    entryId?: string
    contentType?: string
    locationId?: string
    employeeId?: string
    completedBy?: string
    taskName?: string
    minutes?: number
}

const REV_KEY = 'revision'

// Same buckets the Contentful webhook bumps when these entries are published,
// so other devices' live polling still picks up completions
const CONTENT_TYPE_TO_BUCKET: Record<string, keyof Revision['buckets']> = {
    taskInstance: 'taskInstances',
    singleTask: 'singleTask'
}

const COMPLETABLE_CONTENT_TYPES = ['taskInstance', 'setDayTask', 'singleTask']

export default defineEventHandler(async (event) => {
    await requireUser(event) // 🔒 only logged-in staff can call this

    const body = (await readBody(event)) as CompleteBody | undefined
    const entryId = body?.entryId
    const contentType = body?.contentType

    if (!entryId || !contentType) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing entryId or contentType'
        })
    }

    if (!COMPLETABLE_CONTENT_TYPES.includes(contentType)) {
        throw createError({
            statusCode: 400,
            statusMessage: `Cannot complete a ${contentType}`
        })
    }

    const minutes = Math.max(0, Math.round(Number(body?.minutes) || 0))

    const supabase = await serverSupabaseClient(event)
    const { data, error } = await supabase
        .from('task_completions')
        .insert({
            entry_id: entryId,
            content_type: contentType,
            location_id: body?.locationId || null,
            employee_id: body?.employeeId || null,
            completed_by: body?.completedBy || null,
            task_name: body?.taskName || null,
            minutes
        })
        .select('id, completed_at')
        .single()

    if (error) {
        console.error('Task completion insert failed:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Task completion could not be saved'
        })
    }

    const bucket = CONTENT_TYPE_TO_BUCKET[contentType]
    if (bucket) {
        try {
            const storage = useStorage('contentful')
            const current = await storage.getItem<Revision>(REV_KEY)
            if (current) {
                current.global += 1
                current.buckets[bucket] = (current.buckets[bucket] ?? 0) + 1
                await storage.setItem(REV_KEY, current)
            }
        } catch (err) {
            // Other devices just catch up on their next refresh
            console.warn('[tasks/complete] revision bump failed', err)
        }
    }

    return { ok: true, ...data }
})
