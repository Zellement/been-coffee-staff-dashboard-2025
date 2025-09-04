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
            {{ articles }}
        </template>
    </u-slideover>
</template>

<script lang="ts" setup>
const cachedDataStore = useCachedDataStore()
const articles: Ref<TypeArticle[] | null> = ref(null)

const show: Ref<boolean> = ref(false)

const fetchArticles = async () => {
    const data = await $fetch('/api/contentful/fetch-entries', {
        method: 'GET',
        params: {
            content_type: 'article',
            include: 2
        }
    })

    articles.value = data.items || null
    cachedDataStore.cachedAllArticles = articles.value
}

watch(show, (newVal) => {
    if (newVal) {
        if (cachedDataStore.cachedAllArticles) {
            articles.value = cachedDataStore.cachedAllArticles
            console.log('dont need to')
            return
        }
        console.log('fetching')
        fetchArticles()
    }
})
</script>
