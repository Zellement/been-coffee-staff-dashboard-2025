<template>
    <u-slideover
        v-model:open="show"
        description="All Been Coffee articles"
        title="Dashboard navigation"
    >
        <u-button
            label="Menu"
            size="xs"
            color="neutral"
            variant="subtle"
            trailing-icon="i-material-symbols-light-menu-open-rounded"
            :ui="{
                trailingIcon: '!size-5'
            }"
        />

        <template #body>
            <u-navigation-menu
                v-if="articles"
                orientation="vertical"
                :items="articles"
                class="w-full justify-center"
                :ui="{
                    link: '!text-primary-500 dark:!text-primary-200'
                }"
            />
            <u-badge
                v-else
                icon="i-svg-spinners-blocks-shuffle-3"
                size="lg"
                variant="outline"
                label="Loading"
            />
        </template>
    </u-slideover>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const cachedDataStore = useCachedDataStore()
const articles: Ref<NavigationMenuItem[] | null> = ref(null)

const show: Ref<boolean> = ref(false)

const fetchArticles = async () => {
    const data = await $fetch('/api/contentful/fetch-entries', {
        method: 'GET',
        params: {
            content_type: 'article',
            include: 2,
            order: 'fields.title'
        }
    })

    const organisedArticles = transformAndStoreArticles(data.items) as any
    cachedDataStore.cachedAllCategoriesWithArticles = organisedArticles
    articles.value = organisedArticles
}

// Get articles and put them into their categories
const transformAndStoreArticles = (
    items: TypeArticle[]
): NavigationMenuItem[] => {
    // Deduplicate categories using a Set
    const categorySet = new Set<string>()
    const categoryList: NavigationMenuItem[] = []

    items.forEach((item) => {
        if (item.fields.categories && Array.isArray(item.fields.categories)) {
            item.fields.categories.forEach((cat: TypeArticleCategories) => {
                if (cat?.fields?.slug && !categorySet.has(cat.fields.slug)) {
                    categorySet.add(cat.fields.slug)
                    categoryList.push({
                        label: cat.fields.title,
                        to: cat.fields.slug,
                        icon: cat.fields.icon || 'i-bx-info-circle'
                    })
                }
            })
        }
    })

    // Sort categories alphabetically by their label
    categoryList.sort((a, b) => {
        return a.label!.localeCompare(b.label!)
    })

    // Now associate articles with their categories
    const categoriesWithChildren = categoryList.map((category) => {
        const children = items
            .filter(
                (article) =>
                    article.fields.categories &&
                    article.fields.categories.some(
                        (cat: TypeArticleCategories) =>
                            cat?.fields?.slug === category.to
                    )
            )
            .map((article) => ({
                label: article.fields.title,
                to: `/article/${article.fields.slug}`,
                description: article.fields.description
            }))
        return {
            ...category,
            children
        }
    })

    return categoriesWithChildren
}

watch(show, (newVal) => {
    if (newVal) {
        if (cachedDataStore.cachedAllArticles) {
            articles.value = cachedDataStore.cachedAllArticles
            return
        }
        fetchArticles()
    }
})
</script>
