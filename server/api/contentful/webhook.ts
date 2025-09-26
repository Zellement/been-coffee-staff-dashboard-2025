// server/api/contentful/webhook.post.ts
import { defineEventHandler, getQuery, readRawBody } from 'h3'
const REV_KEY = 'contentful:revision'

export default defineEventHandler(async (event) => {
    const { secret } = getQuery(event)
    if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const raw = await readRawBody(event)
    const payload = raw ? JSON.parse(raw) : {}

    const storage = useStorage()
    const current = (await storage.getItem<any>(REV_KEY)) || { rev: 0 }
    const nextRev = Number(current.rev || 0) + 1

    const record = {
        rev: nextRev,
        lastUpdatedAt:
            payload?.sys?.updatedAt ||
            payload?.sys?.firstPublishedAt ||
            new Date().toISOString(),
        lastId: payload?.sys?.id || null,
        lastType: payload?.sys?.type || null
    }

    await storage.setItem(REV_KEY, record)
    // Optional log while developing:
    console.log('[contentful:webhook] rev ->', nextRev)
    return { ok: true, rev: nextRev }
})
