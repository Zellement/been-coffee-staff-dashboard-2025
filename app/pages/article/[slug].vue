<template>
    <div class="p-default xl:my-12">
        <div class="grid gap-8 xl:grid-cols-2">
            <div>
                <h1 class="uc-text text-lg">
                    {{ currentArticle.fields.title }}
                </h1>
                <h2 v-if="currentArticle.fields.subtitle">
                    {{ currentArticle.fields.subtitle }}
                </h2>
                <u-badge
                    v-if="currentArticle.sys.updatedAt"
                    class="mt-6"
                    variant="outline"
                    :label="`Last updated:
                        ${fullDateConverter(currentArticle.sys.updatedAt, true)}
                    `"
                />
                <u-badge
                    v-else
                    class="mt-6"
                    variant="outline"
                    :label="`Created:
                        ${fullDateConverter(currentArticle.sys.createdAt, true)}
                    `"
                />
            </div>
            <div class="">
                <rich-text :content="currentArticle.fields.content" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const articleStore = useArticleStore()

const currentArticle: ComputedRef<TypeArticle | null> = computed(() => {
    return articleStore.currentArticle
})

const { fullDateConverter } = useDateUtils()

definePageMeta({
    middleware: 'article'
})
</script>
