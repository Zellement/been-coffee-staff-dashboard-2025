import { defineStore } from 'pinia'
import type { NavigationMenuItem } from '@nuxt/ui'

export const useArticlesStore = defineStore(
    'articles',
    () => {
        const cachedAllArticles = ref<TypeArticle[] | null>(null)
        const cachedAllCategoriesWithArticles = ref<
            NavigationMenuItem[] | null
        >(null)
        const lastFetched = ref<Date | null>(null)

        const clearCache = () => {
            cachedAllArticles.value = null
            cachedAllCategoriesWithArticles.value = null
            lastFetched.value = null
            localStorage.removeItem('cachedData')
        }

        return {
            cachedAllArticles,
            cachedAllCategoriesWithArticles,
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
