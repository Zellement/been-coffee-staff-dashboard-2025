import { defineStore } from 'pinia'

export const useEmployeesStore = defineStore('employees', () => {
    /**
     * State
     **/

    const allEmployees: Ref<TypeEmployee[] | null> = ref(null)
    const allLeads: Ref<TypeEmployee[] | null> = ref(null)

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
        allEmployees,
        allLeads
    }
})
