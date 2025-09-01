import { defineStore } from 'pinia'

export const useCachedDataStore = defineStore(
    'cachedData',
    () => {
        const cachedStandingOrders = ref<TypeStandingOrder[] | null>(null)

        const clearAllCachedData = () => {
            cachedStandingOrders.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedStandingOrders,
            clearAllCachedData
        }
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage()
        }
    }
)
