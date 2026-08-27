import { defineStore } from 'pinia'

/**
 * Caches Rotaready dates of birth by user id, so rest-break entitlement can be
 * worked out per shift. Rotaready is the source of truth here — the Contentful
 * `dateOfBirth` field is a birthday with no reliable year and is only used for
 * birthday presents.
 *
 * The whole staff list is one API call, so it's fetched once and reused.
 */
export const useStaffDobStore = defineStore('staffDob', () => {
    /**
     * State
     **/
    const dobByUserId: Ref<Record<number, string | null>> = ref({})
    const loaded: Ref<boolean> = ref(false)
    const inFlight: Ref<Promise<void> | null> = ref(null)

    /**
     * Getters
     **/
    const getDateOfBirth = (userId?: number): string | null =>
        userId ? (dobByUserId.value[userId] ?? null) : null

    /**
     * Actions
     **/

    /** Loads every staff date of birth once. Safe to call repeatedly. */
    const ensureLoaded = async (): Promise<void> => {
        if (loaded.value) return
        if (inFlight.value) return inFlight.value

        inFlight.value = (async (): Promise<void> => {
            try {
                dobByUserId.value = await $fetch<Record<number, string | null>>(
                    '/api/rotaready/get-staff-dob'
                )
                loaded.value = true
            } finally {
                inFlight.value = null
            }
        })()

        return inFlight.value
    }

    /**
     * Return
     **/
    return {
        dobByUserId,
        loaded,
        getDateOfBirth,
        ensureLoaded
    }
})
