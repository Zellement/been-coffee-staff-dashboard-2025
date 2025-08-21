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

    /**
     * Actions
     **/

    /**
     * Return
     **/
    return {
        allLocations,
        totalLocations,
        activeLocation
    }
})
