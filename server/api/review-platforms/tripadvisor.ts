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
        // Tripadvisor Terra API (replaced the legacy Content API)
        const url = `https://terra.tripadvisor.com/api/locations/${place_id}/reviews`
        return await $fetch(url, {
            headers: {
                'X-API-Key': process.env.TRIPADVISOR_KEY ?? '',
                accept: 'application/json'
            },
            query: { version: 1, language: 'en', sort_by: 'MOST_RECENT' }
        })
    } catch (err: any) {
        console.error('Tripadvisor reviews fetch failed:', err?.data ?? err)
        throw createError({
            statusCode: err?.statusCode ?? 502,
            statusMessage: 'Tripadvisor reviews fetch failed'
        })
    }
})
