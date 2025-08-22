import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', () => {
    /**
     * State
     **/

    const allOrders: Ref<TypeOrder[] | null> = ref(null)
    const totalOrders: Ref<number | null> = ref(null)

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
        allOrders,
        totalOrders
    }
})
