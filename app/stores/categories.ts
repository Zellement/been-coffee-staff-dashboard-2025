import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', () => {
    /**
     * State
     **/

    const currentCategory: Ref<TypeArticleCategories | null> = ref(null)
    const currentCategorysEntries: Ref<TypeArticle[] | null> = ref(null)

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
        currentCategory,
        currentCategorysEntries
    }
})
