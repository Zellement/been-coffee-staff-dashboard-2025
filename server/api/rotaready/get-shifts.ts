// server/api/rotaready-staff.get.ts
import { getRotareadyToken } from '../../utils/rotaready/get-token'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const token = await getRotareadyToken()

    // Build Rotaready query parameters
    const params = new URLSearchParams()

    if (query.startDate) {
        // Rotaready expects YYYY-MM-DD format
        const date = new Date(query.startDate as string)
        params.append('startDateMin', String(date.toISOString().split('T')[0]))
    }

    // You could also add optional filters if you want
    if (query.endDate) {
        const date = new Date(query.endDate as string)
        params.append('startDateMax', String(date.toISOString().split('T')[0]))
    }

    const url = `https://api.rotaready.com/rota/shift/paginated?${params.toString()}`
    console.log('Fetching Rotaready shifts:', url)

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!res.ok) {
        throw new Error(`Rotaready staff request failed: ${res.status}`)
    }

    return await res.json()
})
