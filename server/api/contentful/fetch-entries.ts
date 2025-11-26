// server/api/contentful/fetch-entries.get.ts  (or .ts if you only need GET)
import { getQuery } from 'h3'
import * as contentful from 'contentful'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
    await requireUser(event) // 🔒 only logged-in staff can call this

    const config = useRuntimeConfig()
    const accessKey = config.CONTENTFUL_CDA_ACCESS_TOKEN as string
    const spaceId = config.CONTENTFUL_SPACE_ID as string
    const environmentId =
        (config.CONTENTFUL_ENVIRONMENT_ID as string) || 'master'

    const client = contentful.createClient({
        space: spaceId,
        accessToken: accessKey,
        environment: environmentId
    })

    const params = getQuery(event)

    try {
        const entries = await client.getEntries(params)
        // @ts-expect-error stringifySafe exists
        return JSON.parse(entries.stringifySafe())
    } catch (err) {
        let message = 'Unknown error'
        if (err instanceof Error) message = err.message
        return { error: 'Failed to fetch entry', details: message }
    }
})
