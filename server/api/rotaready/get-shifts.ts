// server/api/rotaready-staff.get.ts
import { getRotareadyToken } from '../../utils/rotaready/get-token'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const token = await getRotareadyToken()

    // Build Rotaready query parameters
    const params = new URLSearchParams()

    if (query.startDateMin) {
        // Rotaready expects YYYY-MM-DD format
        const date = new Date(query.startDateMin as string)
        params.append('startDateMin', String(date.toISOString().split('T')[0]))
    }

    if (query.startDateMax) {
        const date = new Date(query.startDateMax as string)
        params.append('startDateMax', String(date.toISOString().split('T')[0]))
    }

    if (query.endDateMin) {
        const date = new Date(query.endDateMin as string)
        params.append('endDateMin', String(date.toISOString().split('T')[0]))
    }

    if (query.endDateMax) {
        const date = new Date(query.endDateMax as string)
        params.append('endDateMax', String(date.toISOString().split('T')[0]))
    }

    const url = `https://api.rotaready.com/rota/shift/paginated?${params.toString()}&limit=100`

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
