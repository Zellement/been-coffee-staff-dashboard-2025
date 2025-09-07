import { defineStore } from 'pinia'
import type { NavigationMenuItem } from '@nuxt/ui'

export const useCachedDataStore = defineStore(
    'cachedData',
    () => {
        const cachedBeenAwesomeWinners = ref<TypeBeenAwesomeWinner[] | null>(
            null
        )

        const cachedAllArticles = ref<TypeArticle[] | null>(null)
        const cachedAllCategoriesWithArticles = ref<
            NavigationMenuItem[] | null
        >(null)

        const clearAllCachedData = () => {
            cachedBeenAwesomeWinners.value = null
            cachedAllArticles.value = null
            cachedAllCategoriesWithArticles.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedBeenAwesomeWinners,
            cachedAllArticles,
            cachedAllCategoriesWithArticles,
            clearAllCachedData
        }
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage()
        }
    }
)
