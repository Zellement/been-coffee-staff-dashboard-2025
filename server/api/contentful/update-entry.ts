import { readBody } from 'h3'
import type { EntryProps } from 'contentful-management'
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
        const cma = getCmaClient()

        const entry: EntryProps = await cma.entry.get({ entryId: id })

        // Contentful CMA expects: entry.fields[fieldId][locale] = value
        for (const [fieldId, value] of Object.entries(updates)) {
            if (!entry.fields[fieldId]) entry.fields[fieldId] = {}
            entry.fields[fieldId][locale] = value
        }

        const updated = await cma.entry.update({ entryId: id }, entry)
        const result = await cma.entry.publish({ entryId: id }, updated)

        // Invalidate cached reads now rather than waiting for the webhook, so
        // the client's follow-up refetch gets fresh data
        await markContentTypesChanged([result.sys.contentType.sys.id]).catch(
            (err: unknown): void =>
                console.warn('[contentful-cache] stamp failed', err)
        )

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
