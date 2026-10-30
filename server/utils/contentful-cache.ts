import { createHash } from 'node:crypto'

/**
 * Shared cache for Contentful Delivery API reads, so every tablet, phone and
 * hourly reload doesn't cost an API call when nothing has changed.
 *
 * Each cached response records the content types it contains (including
 * linked entries and assets). When something is published, the webhook (and
 * our own write endpoints) stamp that content type with the time, and any
 * cached response containing it is treated as stale.
 *
 * Lives in the `contentful` storage mount (Netlify Blobs in production) so
 * all function instances share it.
 */

type CachedResponse<T> = {
    fetchedAt: number
    contentTypes: string[]
    data: T
}

// Safety net in case a webhook is ever missed
const CACHE_TTL_MS = 60 * 60 * 1000

// The Delivery API can lag a publish by a few seconds, so anything fetched
// this soon after a change isn't trusted and gets fetched again next time
const PUBLISH_GRACE_MS = 10 * 1000

const ASSET_TYPE = 'asset'

// Stamped when a change's content type can't be worked out; every cached
// response checks it, so an unknown change invalidates everything
export const ANY_CONTENT_TYPE = '*'

const storage = () => useStorage('contentful')

const stampKey = (contentType: string): string =>
    `stamp:${encodeURIComponent(contentType)}`

const cacheKey = (params: Record<string, unknown>): string => {
    const stable = Object.keys(params)
        .sort()
        .map((key: string): string => `${key}=${String(params[key])}`)
        .join('&')
    return `entries:${createHash('sha1').update(stable).digest('hex')}`
}

/**
 * Walk a (link-resolved) Contentful response and collect every content type
 * in it, plus `asset` if any assets are linked.
 *
 * Unresolved links (beyond the include depth, or to drafts) carry no content
 * type and aren't tagged; tagging them would invalidate nearly every query
 * on every publish. The rare miss (a linked draft being published, with no
 * other entry of its type in the response) is caught by the TTL.
 */
const collectContentTypes = (data: unknown): string[] => {
    const types = new Set<string>()

    const walk = (node: unknown): void => {
        if (Array.isArray(node)) {
            node.forEach(walk)
            return
        }
        if (!node || typeof node !== 'object') return

        const sys = (node as { sys?: Record<string, any> }).sys
        if (sys?.type === 'Entry' && sys.contentType?.sys?.id)
            types.add(sys.contentType.sys.id)
        if (sys?.type === 'Asset') types.add(ASSET_TYPE)

        Object.values(node).forEach(walk)
    }

    walk(data)
    return Array.from(types)
}

export async function markContentTypesChanged(
    contentTypes: string[]
): Promise<void> {
    const now = Date.now()
    // One key per type so concurrent webhooks can't overwrite each other
    await Promise.all(
        contentTypes.map(
            (contentType: string): Promise<void> =>
                storage().setItem(stampKey(contentType), now)
        )
    )
}

const isFresh = async <T>(cached: CachedResponse<T>): Promise<boolean> => {
    if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) return false

    const stamps = await Promise.all(
        [...cached.contentTypes, ANY_CONTENT_TYPE].map(
            (contentType: string): Promise<number | null> =>
                storage().getItem<number>(stampKey(contentType))
        )
    )

    return stamps.every(
        (stamp: number | null): boolean =>
            !stamp || cached.fetchedAt > stamp + PUBLISH_GRACE_MS
    )
}

export async function getCachedEntries<T>(
    params: Record<string, unknown>,
    fetcher: () => Promise<T>
): Promise<T> {
    const key = cacheKey(params)

    try {
        const cached = await storage().getItem<CachedResponse<T>>(key)
        if (cached && (await isFresh(cached))) return cached.data
    } catch (err) {
        // Storage trouble must never stop the dashboard loading
        console.warn('[contentful-cache] read failed', err)
    }

    // Taken before fetching, so a publish landing mid-fetch still makes this
    // response count as stale
    const fetchStartedAt = Date.now()
    const data = await fetcher()

    try {
        const contentTypes = collectContentTypes(data)
        // Include the queried type: `select` queries come back without
        // sys.contentType, and an empty result still needs invalidating when
        // the first entry of that type is published
        if (typeof params.content_type === 'string')
            contentTypes.push(params.content_type)

        await storage().setItem<CachedResponse<T>>(key, {
            fetchedAt: fetchStartedAt,
            contentTypes: Array.from(new Set(contentTypes)),
            data
        })
    } catch (err) {
        console.warn('[contentful-cache] write failed', err)
    }

    return data
}
