import { readBody } from 'h3'
import type { Entry } from 'contentful-management'
import { requireUser } from '../../utils/require-user'

type UpdateBody = {
    fields?: Record<string, any>
    locale?: string
    publish?: boolean
    id: string
}

export default defineEventHandler(async (event) => {
    await requireUser(event) // 🔒 only logged-in staff can call this

    const body = (await readBody(event)) as UpdateBody | undefined
    const id = body?.id

    if (!id) {
        return sendError(
            event,
            createError({ statusCode: 400, statusMessage: 'Missing entry id' })
        )
    }

    const updates = body?.fields || {}
    const locale = body?.locale || 'en-GB'

    try {
        const env = await getCmaEnvironment()

        let entry: Entry = await env.getEntry(id)

        // Contentful CMA expects: entry.fields[fieldId][locale] = value
        for (const [fieldId, value] of Object.entries(updates)) {
            if (!entry.fields[fieldId]) entry.fields[fieldId] = {}
            entry.fields[fieldId][locale] = value
        }

        entry = await entry.update()
        const result = await entry.publish()

        return {
            ok: true,
            id: result.sys.id,
            version: result.sys.version,
            publishedVersion: result.sys.publishedVersion ?? null,
            environment: result.sys.environment?.sys?.id,
            updatedAt: result.sys.updatedAt,
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
