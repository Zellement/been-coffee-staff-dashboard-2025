import { getJson } from 'serpapi'

export default defineEventHandler(async (event) => {
    // Get place_id from the API call
    const query = getQuery(event)
    const place_id = query.place_id

    try {
        const response = await getJson({
            engine: 'google_maps_reviews',
            place_id: place_id,
            hl: 'en',
            sort_by: 'newestFirst',
            api_key: process.env.SERP_API_KEY
        })
        return response
    } catch (err) {
        console.error(err)
    }
})
