// server/api/rotaready-staff.get.ts
import { getRotareadyToken } from '../../utils/rotaready/get-token'

export default defineEventHandler(async () => {
    const token = await getRotareadyToken()

    console.log('Using Rotaready token:', token)

    const res = await fetch('https://api.rotaready.com/rota/shift/paginated', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!res.ok) {
        throw new Error(`Rotaready staff request failed: ${res.status}`)
    }

    return await res.json()
})
