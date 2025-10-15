import { defineStore } from 'pinia'
import type { TypeOperations } from '~/types/contentful'

export const useOperationsStore = defineStore('operations', () => {
    /**
     * State
     **/
    // @ts-expect-error This should be fine?!
    const operationsData: Ref<TypeOperations | null> = ref(null)

    /**
     * Getters
     **/

    const getLeadershipTeam: ComputedRef<TypeEmployee[] | null> = computed(
        () => {
            if (!operationsData.value?.fields.leadership) return null
            return operationsData.value.fields.leadership
        }
    )

    /**
     * Return
     **/
    return {
        operationsData,
        getLeadershipTeam
    }
})
