<template>
    <div class="p-default">
        <h1 v-if="currentCategory?.fields" class="uc-text mb-4">
            {{ currentCategory?.fields.title }}
        </h1>
        <h2 v-if="currentCategory?.fields.description" class="mb-8">
            {{ currentCategory?.fields.description }}
        </h2>
        <div
            v-if="hasArticles"
            class="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 lg:gap-6"
        >
            <u-card
                v-for="article in articles"
                :key="article.sys.id"
                :ui="{
                    body: 'h-full flex w-full flex-col items-start'
                }"
            >
                <h2 class="text-primary dark:text-secondary font-bold">
                    {{ article.fields.title }}
                </h2>
                <p
                    v-if="article.fields.subtitle"
                    class="text-primary-300 dark:text-primary-300 mb-4"
                >
                    {{ article.fields.subtitle }}
                </p>
                <u-button
                    class="mt-auto"
                    :to="`/article/${article.fields.slug}`"
                    variant="outline"
                >
                    Read More
                </u-button>
            </u-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'category'
})

const categoriesStore = useCategoriesStore()

const articles: ComputedRef<TypeArticle[] | null> = computed(() => {
    return categoriesStore.currentCategorysEntries
})

const hasArticles: ComputedRef<boolean> = computed(() => {
    return !!(articles.value && articles.value.length > 0)
})

const currentCategory: ComputedRef<TypeArticleCategories | null> = computed(
    () => {
        return categoriesStore.currentCategory
    }
)

useHead({
    title: `${currentCategory.value?.fields.title} | Been Coffee Staff Dashboard`
})
</script>
