// server/utils/rotareadyToken.ts
let cachedToken: { access_token: string; fetchedAt: number } | null = null

export async function getRotareadyToken() {
    // If token exists, reuse it
    if (cachedToken) {
        return cachedToken.access_token
    }

    const realm = process.env.ROTAREADY_REALM!
    const key = process.env.ROTAREADY_KEY!
    const secret = process.env.ROTAREADY_SECRET!

    const basicAuth = Buffer.from(`${realm}:${key}:${secret}`).toString(
        'base64'
    )

    const res = await fetch('https://api.rotaready.com/oauth/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' })
    })

    if (!res.ok) {
        throw new Error(`Rotaready token request failed: ${res.status}`)
    }

    const data = await res.json()
    cachedToken = { access_token: data.access_token, fetchedAt: Date.now() }

    return data.access_token
}
