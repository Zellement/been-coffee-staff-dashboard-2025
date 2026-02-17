export default defineEventHandler(async (event) => {
    // Get place_id from the API call
    const query = getQuery(event)
    const place_id = query.place_id

    const options: RequestInit = {
        method: 'GET',
        referrer: 'https://dashboard.been.coffee',
        referrerPolicy: 'no-referrer-when-downgrade' as ReferrerPolicy,
        headers: {
            referrer: 'https://dashboard.been.coffee',
            accept: 'application/json'
        }
    }

    try {
        const url = `https://api.content.tripadvisor.com/api/v1/location/${place_id}/reviews?key=${process.env.TRIPADVISOR_KEY}&language=en`
        const response = await fetch(url, options)
        const data = await response.json()
        return data
    } catch (err) {
        console.error(err)
    }
})
