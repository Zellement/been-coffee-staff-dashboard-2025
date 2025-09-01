import { defineStore } from 'pinia'

export const useCachedDataStore = defineStore(
    'cachedData',
    () => {
        const cachedStandingOrders = ref<TypeStandingOrder[] | null>(null)
        const cachedBeenAwesomeWinners = ref<TypeBeenAwesomeWinner[] | null>(
            null
        )

        const clearAllCachedData = () => {
            cachedStandingOrders.value = null
            cachedBeenAwesomeWinners.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedStandingOrders,
            cachedBeenAwesomeWinners,
            clearAllCachedData
        }
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage()
        }
    }
)
