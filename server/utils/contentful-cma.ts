import contentfulManagement from 'contentful-management'
import type { PlainClientAPI } from 'contentful-management'

let _client: PlainClientAPI | null = null

/**
 * Plain CMA client with the space and environment baked in as defaults.
 * Unlike the nested client (`getSpace()` -> `getEnvironment()`), it needs
 * no lookup calls before the first real request, which matters on Netlify
 * where cold starts are frequent and every call counts toward the quota.
 */
export function getCmaClient(): PlainClientAPI {
    if (_client) return _client

    const config = useRuntimeConfig()
    const token = config.CONTENTFUL_CMA_ACCESS_TOKEN as string
    const spaceId = config.CONTENTFUL_SPACE_ID as string
    const environmentId =
        (config.CONTENTFUL_ENVIRONMENT_ID as string) || 'master'

    if (!token || !spaceId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Missing Contentful credentials'
        })
    }

    _client = contentfulManagement.createClient(
        { accessToken: token },
        { type: 'plain', defaults: { spaceId, environmentId } }
    )

    return _client
}
