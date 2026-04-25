import { getRotareadyToken } from '../../utils/rotaready/get-token'

export default defineEventHandler(async () => {
    const token = await getRotareadyToken()

    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 30)

    const qs = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
        dateContext: 'overlapping',
        limit: '100'
    })
    qs.append('approvalStates[]', '1')

    const res = await fetch(
        `https://api.rotaready.com/absence/paginated?${qs}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!res.ok)
        throw createError({
            statusCode: res.status,
            statusMessage: 'Rotaready absence request failed'
        })

    return res.json()
})
