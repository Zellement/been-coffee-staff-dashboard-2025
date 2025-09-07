import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', () => {
    const currentArticle = ref<TypeArticle[] | null>(null)

    return {
        currentArticle
    }
})
