// server/api/contentful/update.get.ts (or .post.ts if you prefer POST only)
import { readBody } from 'h3'
import contentfulManagement from 'contentful-management'
import type { Entry } from 'contentful-management'
import { requireUser } from '../../utils/require-user'

type UpdateBody = {
    // Simple shape: { fields: { title: 'New title', slug: 'new-slug', ... }, locale?: 'en-GB', publish?: boolean }
    data?: Record<string, any>
    locale?: string
    publish?: boolean
    id: string
}

export default defineEventHandler(async (event) => {
    await requireUser(event) // 🔒 only logged-in staff can call this
    const config = useRuntimeConfig()

    const token = config.CONTENTFUL_CMA_ACCESS_TOKEN as string
    const spaceId = config.CONTENTFUL_SPACE_ID as string
    const defaultEnv = (config.CONTENTFUL_ENVIRONMENT_ID as string) || 'master'

    if (!token || !spaceId) {
        return sendError(
            event,
            createError({
                statusCode: 500,
                statusMessage: 'Missing Contentful credentials'
            })
        )
    }

    const body = (await readBody(event)) as UpdateBody | undefined
    const id = body?.id

    if (!id) {
        return sendError(
            event,
            createError({ statusCode: 400, statusMessage: 'Missing entry id' })
        )
    }
    const updates = body?.data || {}
    const locale = body?.locale || 'en-GB'
    console.log(updates)
    try {
        // 1) CMA client
        const cma = contentfulManagement.createClient({ accessToken: token })

        // 2) Space + Environment
        const space = await cma.getSpace(spaceId)
        const env = await space.getEnvironment(defaultEnv)

        // 3) Fetch entry
        let entry: Entry = await env.getEntry(id)

        // Get the existing JSON field of taskHistory, which may be empty
        const existingTaskHistory = entry.fields.taskHistory?.[locale] || {}

        // Update the taskHistory field by adding new timeInMinutes and taskName
        const newTimeInMinutes = updates.timeInMinutes || 0
        const newTaskName = updates.taskName || 'Unknown Task'

        // Create a new entry for the task history
        const newTaskEntry = {
            date: new Date().toISOString(),
            taskName: newTaskName,
            timeInMinutes: newTimeInMinutes
        }

        // Append the new entry to the existing taskHistory array
        const updatedTaskHistory = [
            ...(existingTaskHistory.tasksWithMinutes || []),
            newTaskEntry
        ]

        // Prepare the updated taskHistory object
        const updatedTaskHistoryObject = {
            tasksWithMinutes: updatedTaskHistory,
            totalOfAllTimeInMinutes:
                (existingTaskHistory.totalOfAllTimeInMinutes || 0) +
                newTimeInMinutes
        }

        // Set the updated taskHistory back to the entry fields
        entry.fields.taskHistory = {
            ...entry.fields.taskHistory,
            [locale]: updatedTaskHistoryObject
        }

        // 5) Update
        entry = await entry.update()

        // 6) Publish
        const result = await entry.publish()

        return {
            ok: true,
            id: result.sys.id,
            version: result.sys.version,
            publishedVersion: result.sys.publishedVersion ?? null,
            environment: result.sys.environment?.sys?.id,
            updatedAt: result.sys.updatedAt,
            // Return the fields for the requested locale only (nice to consume)
            fields: Object.fromEntries(
                Object.entries(result.fields || {}).map(([k, v]: any) => [
                    k,
                    v?.[locale]
                ])
            )
        }
    } catch (err: any) {
        return sendError(
            event,
            createError({
                statusCode: err?.response?.status || 500,
                statusMessage: err?.message || 'Contentful CMA error',
                data: err?.response?.data || null
            })
        )
    }
})
