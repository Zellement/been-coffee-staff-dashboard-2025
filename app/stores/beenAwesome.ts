import { defineStore } from 'pinia'

export const useBeenAwesomeStore = defineStore(
    'beenAwesome',
    () => {
        const cachedBeenAwesomeWinners = ref<TypeBeenAwesomeWinner[] | null>(
            null
        )
        const lastFetched: Ref<Date | null> = ref(null)

        // const beenAwesomeWinnersLastFive: ComputedRef<TypeBeenAwesomeWinner[]> =
        //     computed(() => {
        //         if (!cachedBeenAwesomeWinners.value) return []
        //         return cachedBeenAwesomeWinners.value.slice(0, 5)
        //     })

        // const beenAwesomeWinnersRemaining: ComputedRef<
        //     TypeBeenAwesomeWinner[]
        // > = computed(() => {
        //     if (!cachedBeenAwesomeWinners.value) return []
        //     return cachedBeenAwesomeWinners.value.slice(5)
        // })

        const clearCache = () => {
            cachedBeenAwesomeWinners.value = null
            lastFetched.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedBeenAwesomeWinners,
            // beenAwesomeWinnersLastFive,
            // beenAwesomeWinnersRemaining,
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
