// server/utils/rotaready/get-staff-dobs.ts
import { getRotareadyToken } from './get-token'

/**
 * A Rotaready staff account carries a great deal of sensitive data — national
 * insurance number, bank details, passport number, home address. We read only
 * the date of birth and discard the rest, so nothing else can leak outwards.
 */
type RotareadyStaffAccountsResponse = {
    users?: Array<{
        id?: number
        personal?: { dob?: string | null }
    }>
}

/** Rotaready rejects a limit outside 5-50, and pages are 1-based. */
const PAGE_LIMIT = 50
const MAX_PAGES = 20 // backstop; ~1000 staff
const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000 // dates of birth barely change

let _dobs: Record<number, string | null> | null = null
let _fetchedAt = 0
let _inFlight: Promise<Record<number, string | null>> | null = null

async function requestAllStaffDobs(): Promise<Record<number, string | null>> {
    const token = await getRotareadyToken()
    const dobs: Record<number, string | null> = {}

    for (let page = 1; page <= MAX_PAGES; page++) {
        const qs = new URLSearchParams({
            limit: String(PAGE_LIMIT),
            page: String(page)
        })

        const res = await fetch(
            `https://api.rotaready.com/staff/account/paginated?${qs}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!res.ok) {
            throw new Error(
                `Rotaready staff accounts request failed: ${res.status}`
            )
        }

        const json = (await res.json()) as RotareadyStaffAccountsResponse
        const users = json.users ?? []

        for (const user of users) {
            if (user.id) dobs[user.id] = user.personal?.dob ?? null
        }

        // Last page
        if (users.length < PAGE_LIMIT) break
    }

    return dobs
}

/**
 * Returns a cached map of Rotaready user id -> ISO date of birth for all staff.
 * Rotaready is the source of truth for date of birth: it is mandatory there,
 * whereas the Contentful `dateOfBirth` field is a birthday with no reliable
 * year and is only used for birthday presents.
 */
export async function getStaffDobs(): Promise<Record<number, string | null>> {
    if (_dobs && Date.now() - _fetchedAt < CACHE_MAX_AGE_MS) {
        return _dobs
    }

    // Collapse concurrent callers
    if (_inFlight) return _inFlight

    _inFlight = (async (): Promise<Record<number, string | null>> => {
        try {
            const dobs = await requestAllStaffDobs()
            _dobs = dobs
            _fetchedAt = Date.now()
            return dobs
        } finally {
            _inFlight = null
        }
    })()

    return _inFlight
}
