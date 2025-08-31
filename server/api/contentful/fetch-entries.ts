import { getQuery } from 'h3'
import * as contentful from 'contentful'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessKey = config.CONTENTFUL_CDA_ACCESS_TOKEN as string
    const spaceId = config.CONTENTFUL_SPACE_ID as string

    const client = contentful.createClient({
        space: spaceId,
        accessToken: accessKey
    })

    const params = getQuery(event)

    try {
        const entries = await client.getEntries(params)
        // @ts-expect-error stringifySafe exists
        return JSON.parse(entries.stringifySafe())
    } catch (err) {
        let message = 'Unknown error'
        if (err instanceof Error) {
            message = err.message
        }
        return { error: 'Failed to fetch entry', details: message }
    }
})
