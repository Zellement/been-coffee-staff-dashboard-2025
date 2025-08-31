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

        return getTeamFromActiveLocation?.[0]?.fields.teamHierarchy || []
    })

    const acceptableShiftLeads: string[] = [
        'Manager',
        'Assistant Manager',
        'Shift Lead'
    ]

    const getAllLeads: ComputedRef<TypeEmployee[]> = computed(() => {
        return getAllTeamMembers.value.filter((member) =>
            acceptableShiftLeads.includes(member.fields.jobRole)
        )
    })

    /**
     * Actions
     **/

    /**
     * Return
     **/
    return {
        allLocations,
        totalLocations,
        activeLocation,
        getAllTeamMembers,
        getAllLeads
    }
})
