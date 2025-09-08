export default defineNuxtRouteMiddleware(async (to) => {
    const categoriesStore = useCategoriesStore()

    // Directly filter on the referenced category's fields (single reference)
    const entries = await $fetch('/api/contentful/fetch-entries', {
        params: {
            content_type: 'article',
            'fields.category.sys.contentType.sys.id': 'articleCategories',
            'fields.category.fields.slug[match]': to.params.slug?.[0]
        }
    })

    if (entries) {
        categoriesStore.currentCategorysEntries = entries.items
    }

    const category = await $fetch('/api/contentful/fetch-entries', {
        params: {
            content_type: 'articleCategories',
            'fields.slug': to.params.slug?.[0]
        }
    })

    if (category) {
        categoriesStore.currentCategory = category.items?.[0]
    }
})
