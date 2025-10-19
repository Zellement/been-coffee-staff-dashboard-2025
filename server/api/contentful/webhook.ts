// server/api/contentful/webhook.ts  (or .post.ts)
import { defineEventHandler, getQuery, readRawBody, getRequestHeader } from 'h3'

// 🔑 storage key lives at module scope so handler can use it
const REV_KEY = 'contentful:revision'

type Revision = {
    global: number
    buckets: {
        noticeBoard: number
        dailyTasks: number
        routineTasks: number
        taskInstances: number
        beenAwesomeWinners: number
        tableBookings: number
        orders: number
        assets: number
        operations: number
    }
    lastEvent?: { id?: string; contentType?: string | null; at: string }
}

const emptyRev = (): Revision => ({
    global: 0,
    buckets: {
        noticeBoard: 0,
        dailyTasks: 0,
        routineTasks: 0,
        taskInstances: 0,
        beenAwesomeWinners: 0,
        tableBookings: 0,
        orders: 0,
        assets: 0,
        operations: 0
    }
})

// Map your Contentful content type IDs -> buckets you want to refresh
const CONTENT_TYPE_TO_BUCKET: Record<string, keyof Revision['buckets']> = {
    noticeBoard: 'noticeBoard',
    beenAwesomeWinner: 'beenAwesomeWinners',
    tableBooking: 'tableBookings',
    order: 'orders',
    // tasks (model) -> bump their respective instance lists
    routineTask: 'routineTasks',
    dailyTask: 'dailyTasks',
    // if you ever publish instances directly:
    taskInstance: 'taskInstances',
    // assets
    asset: 'assets',
    // operations
    operation: 'operations'
}

export default defineEventHandler(async (event) => {
    // shared-secret check (keep HMAC if you later switch to signature)
    const { secret } = getQuery(event)
    if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const raw = await readRawBody(event)
    const body = raw ? JSON.parse(raw) : {}

    const topic = getRequestHeader(event, 'x-contentful-topic') || '' // e.g. ContentManagement.Entry.publish
    const isAsset = topic.includes('Asset')
    const contentTypeId =
        (isAsset ? 'asset' : body?.sys?.contentType?.sys?.id) || null

    const storage = useStorage() // Nitro global
    const current = (await storage.getItem<Revision>(REV_KEY)) ?? emptyRev()

    current.global += 1

    const bucket = contentTypeId
        ? CONTENT_TYPE_TO_BUCKET[contentTypeId]
        : undefined
    if (bucket) current.buckets[bucket] += 1

    current.lastEvent = {
        id: body?.sys?.id,
        contentType: contentTypeId,
        at: new Date().toISOString()
    }

    await storage.setItem(REV_KEY, current)

    // dev visibility
    console.log(
        '[webhook]',
        'global:',
        current.global,
        'bucket:',
        bucket ?? '(unknown)',
        'ct:',
        contentTypeId
    )

    return { ok: true, ...current }
})
