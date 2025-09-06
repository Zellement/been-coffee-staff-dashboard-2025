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
        if (item.fields.category) {
            if (
                item.fields.category?.fields?.slug &&
                !categorySet.has(item.fields.category.fields.slug)
            ) {
                categorySet.add(item.fields.category.fields.slug)
                categoryList.push({
                    label: item.fields.category.fields.title,
                    to: `/category/${item.fields.category.fields.slug}`,
                    icon:
                        item.fields.category.fields.icon || 'i-bx-info-circle',
                    slug: item.fields.category.fields.slug // store raw slug for matching
                })
            }
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
                    article.fields.category &&
                    article.fields.category.fields.slug === category.slug
            )
            .map((article) => ({
                label: article.fields.title,
                to: `/article/${article.fields.slug}`,
                description: article.fields.description
            }))
        // Remove the helper slug property from the returned object
        const { ...rest } = category
        return {
            ...rest,
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

const route = useRoute()

watch(
    () => route.path,
    () => {
        show.value = false
    }
)
</script>
