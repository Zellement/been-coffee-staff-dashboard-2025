// server/utils/rotaready/get-token.ts
let _token: string | null = null
let _tokenFetchedAt = 0
let _inFlight: Promise<string> | null = null

const TOKEN_MAX_AGE_MS = 6 * 60 * 60 * 1000 // cache for up to 6h (Rotaready tokens have no explicit TTL)
const OAUTH_URL = 'https://api.rotaready.com/oauth/token'

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

async function requestToken(): Promise<string> {
    const realm = process.env.ROTAREADY_REALM!
    const key = process.env.ROTAREADY_KEY!
    const secret = process.env.ROTAREADY_SECRET!
    if (!realm || !key || !secret) {
        throw new Error(
            'Missing ROTAREADY_REALM / ROTAREADY_KEY / ROTAREADY_SECRET env vars'
        )
    }

    const basic = Buffer.from(`${realm}:${key}:${secret}`).toString('base64')

    // 3 attempts with exponential backoff for 429/5xx (including 504)
    const retriable = new Set([429, 500, 502, 503, 504])
    let lastErr: any

    for (let attempt = 1; attempt <= 3; attempt++) {
        const controller = new AbortController()
        const t = setTimeout(() => controller.abort(), 10000) // 10s timeout

        try {
            const res = await fetch(OAUTH_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${basic}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ grant_type: 'client_credentials' }),
                signal: controller.signal
            })

            clearTimeout(t)

            if (res.ok) {
                const json = await res.json()
                if (!json?.access_token) {
                    throw new Error(
                        'OAuth succeeded but no access_token in response'
                    )
                }
                return json.access_token as string
            }

            // Read body for diagnostics
            const text = await res.text().catch(() => '')
            if (!retriable.has(res.status)) {
                throw new Error(
                    `OAuth failed ${res.status} ${res.statusText} ${text}`
                )
            }
            lastErr = new Error(
                `OAuth transient ${res.status}: ${text || res.statusText}`
            )
        } catch (e: any) {
            clearTimeout(t)
            // AbortError / network error: treat as retriable
            lastErr = e
        }

        // backoff: 500ms, 1500ms
        if (attempt < 3) await sleep(500 * attempt ** 2)
    }

    throw new Error(
        `Rotaready token request failed after retries: ${lastErr?.message || lastErr}`
    )
}

export async function getRotareadyToken(): Promise<string> {
    // Serve cached token if fresh
    if (_token && Date.now() - _tokenFetchedAt < TOKEN_MAX_AGE_MS) {
        return _token
    }
    // Collapse concurrent callers
    if (_inFlight) return _inFlight

    _inFlight = (async () => {
        try {
            const tok = await requestToken()
            _token = tok
            _tokenFetchedAt = Date.now()
            return tok
        } finally {
            _inFlight = null
        }
    })()

    return _inFlight
}
