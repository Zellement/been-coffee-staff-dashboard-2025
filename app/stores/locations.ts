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

    /**
     * Actions
     **/

    const setActiveLocation = (locId: string) => {
        if (allLocations.value) {
            const foundLocation = allLocations.value.find(
                (loc) => loc.sys.id === locId
            )
            if (foundLocation) {
                activeLocation.value = foundLocation
            }
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
        getAllLeads,
        setActiveLocation
    }
})
