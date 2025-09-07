import { defineStore } from 'pinia'

export const useBeenAwesomeStore = defineStore(
    'beenAwesome',
    () => {
        const cachedBeenAwesomeWinners = ref<TypeBeenAwesomeWinner[] | null>(
            null
        )
        const lastFetched: Ref<Date | null> = ref(null)

        const clearCache = () => {
            cachedBeenAwesomeWinners.value = null
            lastFetched.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedBeenAwesomeWinners,
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
