import contentfulManagement from 'contentful-management'
import type { Environment } from 'contentful-management'

let _env: Environment | null = null

export async function getCmaEnvironment(): Promise<Environment> {
    if (_env) return _env

    const config = useRuntimeConfig()
    const token = config.CONTENTFUL_CMA_ACCESS_TOKEN as string
    const spaceId = config.CONTENTFUL_SPACE_ID as string
    const envId = (config.CONTENTFUL_ENVIRONMENT_ID as string) || 'master'

    if (!token || !spaceId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Missing Contentful credentials'
        })
    }

    const cma = contentfulManagement.createClient({ accessToken: token })
    const space = await cma.getSpace(spaceId)
    _env = await space.getEnvironment(envId)

    return _env
}
