import { defineStore } from 'pinia'

export const useStandingOrdersStore = defineStore(
    'standingOrders',
    () => {
        const cachedStandingOrders = ref<TypeStandingOrder[] | null>(null)
        const lastFetched: Ref<Date | null> = ref(null)

        const clearCache = () => {
            cachedStandingOrders.value = null
            lastFetched.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedStandingOrders,
            lastFetched,
            clearCache
        }
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage()
        }
    }
)
