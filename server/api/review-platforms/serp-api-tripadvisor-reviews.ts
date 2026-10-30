import { getJson } from 'serpapi'

export default defineEventHandler(async (event) => {
    // Get place_id from the API call
    const query = getQuery(event)
    const place_id = query.place_id

    if (!place_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing place_id'
        })
    }

    try {
        // Used instead of Terra as owner responses are a paid Terra tier
        return await getJson({
            engine: 'tripadvisor_reviews',
            place_id: place_id,
            sort_by: 'most_recent',
            api_key: process.env.SERP_API_KEY
        })
    } catch (err: any) {
        console.error('Tripadvisor reviews fetch failed:', err)
        throw createError({
            statusCode: 502,
            statusMessage: 'Tripadvisor reviews fetch failed'
        })
    }
})
