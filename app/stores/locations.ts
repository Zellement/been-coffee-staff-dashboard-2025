import { defineStore } from 'pinia'

export const useLocationsStore = defineStore('locations', () => {
    /**
     * State
     **/
    const allLocations: Ref<TypeLocation[] | null> = ref(null)
    const totalLocations: Ref<number | null> = ref(null)
    const activeLocation: Ref<TypeLocation | null> = ref(null)

    /**
     * Getters
     **/

    const getAllTeamMembers: ComputedRef<TypeEmployee[]> = computed(() => {
        const getTeamFromActiveLocation =
            allLocations.value?.filter(
                (location) => location.sys.id === activeLocation.value?.sys.id
            ) || []

        const team = getTeamFromActiveLocation?.[0]?.fields.teamHierarchy || []

        if (team.length && team.length > 0) {
            return team?.filter((member: TypeEmployee) => member?.fields?.name)
        }
    })

    /**
     * Team members across every location. Staff can be rota'd to cover at a
     * site other than their home one, so lookups by Rotaready ID need this
     * rather than just the active location's team.
     */
    const getEveryTeamMember: ComputedRef<TypeEmployee[]> = computed(() => {
        return (allLocations.value || [])
            .flatMap(
                (location: TypeLocation): TypeEmployee[] =>
                    location.fields.teamHierarchy || []
            )
            .filter((member: TypeEmployee): boolean => !!member?.fields?.name)
    })

    const getPostcodeById = (locId?: string): string | undefined => {
        return allLocations.value?.find(
            (loc: TypeLocation): boolean => loc.sys.id === locId
        )?.fields.postcode
    }

    const acceptableShiftLeads: string[] = [
        'Manager',
        'Assistant Manager',
        'Shift Lead'
    ]

    const getAllLeads: ComputedRef<TypeEmployee[]> = computed(() => {
        return getAllTeamMembers.value?.filter((member) =>
            acceptableShiftLeads.includes(member.fields.jobRole)
        )
    })

    const safeToFetchAllData: ComputedRef<boolean> = computed(() => {
        return !!activeLocation.value
    })

    /**
     * Actions
     **/

    const setActiveLocation = (locId: string): boolean => {
        if (allLocations.value) {
            const foundLocation = allLocations.value.find(
                (loc) => loc.sys.id === locId
            )
            if (foundLocation) {
                activeLocation.value = foundLocation
                return true
            }
        }
        return false
    }

    /**
     * A location picked from the switcher sticks for the rest of the browser
     * session (survives refreshes) and beats the user's Contentful
     * primaryLocation. Storage can throw in private mode, hence the try/catch.
     */
    const CHOSEN_LOCATION_KEY = 'chosenLocationId'

    const chooseLocation = (locId: string): void => {
        if (!setActiveLocation(locId)) return
        try {
            sessionStorage.setItem(CHOSEN_LOCATION_KEY, locId)
        } catch {
            // Not persisted; the switch still applies until refresh
        }
    }

    const restoreLocation = (fallbackLocId: string | null): void => {
        let chosenLocId: string | null = null
        try {
            chosenLocId = sessionStorage.getItem(CHOSEN_LOCATION_KEY)
        } catch {
            // Fall through to the default location
        }
        if (chosenLocId && setActiveLocation(chosenLocId)) return
        if (fallbackLocId) setActiveLocation(fallbackLocId)
    }

    const forgetChosenLocation = (): void => {
        try {
            sessionStorage.removeItem(CHOSEN_LOCATION_KEY)
        } catch {
            // Nothing to clear
        }
    }

    /**
     * Return
     **/
    return {
        allLocations,
        totalLocations,
        activeLocation,
        getAllTeamMembers,
        getEveryTeamMember,
        getPostcodeById,
        getAllLeads,
        safeToFetchAllData,
        setActiveLocation,
        chooseLocation,
        restoreLocation,
        forgetChosenLocation
    }
})
