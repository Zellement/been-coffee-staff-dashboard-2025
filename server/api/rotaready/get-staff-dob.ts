import { getStaffDobs } from '../../utils/rotaready/get-staff-dobs'
import { requireUser } from '../../utils/require-user'

/**
 * Returns a map of Rotaready user id -> ISO date of birth, and nothing else.
 * Used to work out rest-break entitlement, which differs for under-18s.
 */
export default defineEventHandler(
    async (event): Promise<Record<number, string | null>> => {
        await requireUser(event) // 🔒 date of birth is personal data

        return await getStaffDobs()
    }
)
