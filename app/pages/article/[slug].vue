<template>
    <div class="p-default xl:my-12">
        <div class="grid gap-8 xl:grid-cols-3 xl:gap-40">
            <div>
                <div
                    class="flex flex-col items-start gap-4 xl:sticky xl:top-28 xl:col-span-1 xl:max-w-80 xl:gap-8"
                >
                    <div>
                        <h1 class="uc-text text-lg">
                            {{ currentArticle.fields.title }}
                        </h1>
                        <h2 v-if="currentArticle.fields.subtitle">
                            {{ currentArticle.fields.subtitle }}
                        </h2>
                    </div>
                    <div
                        class="border-primary/10 dark:border-primary w-full border-t pt-4 xl:pt-8"
                    >
                        <h3 class="uc-text uc-text--xs mb-2">Category</h3>
                        <u-button
                            variant="outline"
                            :to="`/category/${currentArticle.fields.category.fields.slug}`"
                            :label="`${currentArticle.fields.category.fields.title}`"
                            :icon="currentArticle.fields.category.fields.icon"
                        />
                    </div>
                    <div
                        v-if="hasFiles"
                        class="border-primary/10 dark:border-primary w-full border-t pt-4 xl:pt-8"
                    >
                        <h3 class="uc-text uc-text--xs mb-2">Related files</h3>
                        <ul class="flex flex-col gap-2">
                            <li
                                v-for="(file, index) in files"
                                :key="index"
                                class="flex items-center gap-2"
                            >
                                <u-button
                                    :label="file.fields.title"
                                    :to="file.fields.file.url"
                                    icon="i-mdi-file-pdf"
                                    variant="outline"
                                />
                            </li>
                        </ul>
                    </div>
                    <div
                        class="border-primary/10 dark:border-primary w-full border-t pt-4 xl:pt-8"
                    >
                        <u-badge
                            v-if="currentArticle.sys.updatedAt"
                            variant="outline"
                            :label="`Last updated:
                        ${fullDateConverter(currentArticle.sys.updatedAt, true)}
                    `"
                        />
                        <u-badge
                            v-else
                            variant="outline"
                            :label="`Created:
                        ${fullDateConverter(currentArticle.sys.createdAt, true)}
                    `"
                        />
                    </div>
                </div>
            </div>
            <div class="xl:col-span-2">
                <rich-text :content="currentArticle.fields.content" />
                <u-button
                    v-if="currentArticle.fields.nextArticle"
                    class="mt-8"
                    :label="`Next article: ${currentArticle.fields.nextArticle.fields.title}`"
                    trailing-icon="i-material-symbols-arrow-right-alt"
                    :to="`/article/${currentArticle.fields.nextArticle.fields.slug}`"
                    color="tertiary"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const articleStore = useArticleStore()

const currentArticle: ComputedRef<TypeArticle | null> = computed(() => {
    return articleStore.currentArticle
})

const files: ComputedRef<any> = computed(() => {
    return currentArticle.value?.fields?.files ?? null
})

const hasFiles: ComputedRef<boolean> = computed(() => {
    return files.value && Array.isArray(files.value) && files.value.length > 0
})

const { fullDateConverter } = useDateUtils()

definePageMeta({
    middleware: 'article'
})

useHead({
    title: `${currentArticle.value?.fields.title} | Been Coffee Staff Dashboard`
})
</script>
