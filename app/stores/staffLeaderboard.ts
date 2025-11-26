import { defineStore } from 'pinia'

export const useStaffLeaderboardStore = defineStore(
    'staffLeaderboard',
    () => {
        const cachedEmployees = ref<TypeEmployee[] | null>(null)
        const lastFetched: Ref<Date | null> = ref(null)

        const clearCache = () => {
            cachedEmployees.value = null
            lastFetched.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedEmployees,
            lastFetched,
            clearCache
        }
    }
    // {
    //     persist: {
    //         storage: piniaPluginPersistedstate.localStorage()
    //     }
    // }
)
