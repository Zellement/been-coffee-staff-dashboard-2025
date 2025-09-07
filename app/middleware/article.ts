export default defineNuxtRouteMiddleware(async (to) => {
    console.log(to)
    const article = await $fetch('/api/contentful/fetch-entries', {
        params: {
            content_type: 'article',
            'fields.slug[match]': to.params.slug
        }
    })

    const articleStore = useArticleStore()
    if (article) {
        articleStore.currentArticle = article.items?.[0]
    }
})
