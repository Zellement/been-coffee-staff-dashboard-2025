// server/api/rotaready/attendance-day.get.ts
import { getRotareadyToken } from '../../utils/rotaready/get-token'

export default defineEventHandler(async (event) => {
    const { userId, date } = getQuery(event) as {
        userId: string
        date?: string
    }

    if (!userId)
        throw createError({ statusCode: 400, statusMessage: 'userId required' })

    const d = new Date(date || new Date().toISOString().slice(0, 10))

    const start = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0)
    ).toISOString()

    const end = new Date(
        Date.UTC(
            d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate() + 1,
            0,
            0,
            0
        )
    ).toISOString()

    const token = await getRotareadyToken()

    const qs = new URLSearchParams({
        userId: String(userId),
        start,
        end,
        limit: '100'
    })

    const res = await fetch(
        `https://api.rotaready.com/attendance/events/paginated?${qs}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    )
    if (!res.ok)
        throw createError({
            statusCode: res.status,
            statusMessage: 'Rotaready attendance failed'
        })
    return res.json() // events: [{eventType: 1|2|3|4, dateUtc: ...}, ...]
})
