<template>
    <div class="page p-default gap-4">
        <u-card>
            <u-select
                v-model="selectedCategory"
                label="Filter by category"
                :items="categoryOptions"
                clearable
                class="z-50 max-w-xs"
            />
        </u-card>
        <masonry-wall
            v-slot="{ item }"
            :items="recipes || []"
            :column-width="200"
            :gap="16"
        >
            <u-card
                :key="item.sys.id"
                :ui="{ body: 'w-full' }"
                class="flex w-full"
            >
                <u-drawer
                    :title="item.fields.title"
                    :description="item.fields.subtitle ?? ''"
                    direction="left"
                    class="w-full"
                >
                    <button
                        class="flex h-full w-full flex-col items-start gap-2"
                    >
                        <img
                            v-if="
                                item.fields.media?.fields?.file?.url &&
                                item.fields.media?.fields?.file?.contentType?.startsWith(
                                    'image/'
                                )
                            "
                            class="w-full"
                            :src="`${
                                item.fields.media?.fields?.file?.url
                            }?w=300&fit=fill&f=center&fm=webp`"
                            :alt="item.fields.name"
                        />
                        <video
                            v-else-if="
                                item.fields.media?.fields?.file?.url &&
                                item.fields.media?.fields?.file?.contentType?.startsWith(
                                    'video/'
                                )
                            "
                            :src="item.fields.media?.fields?.file?.url"
                        />
                        <div
                            v-else
                            class="dark:bg-navy-500 h-[200px] w-[300px] bg-gray-200"
                        />
                        <div class="flex flex-col items-start">
                            <h2 class="uc-text">
                                {{ item.fields.title }}
                                ({{ item.fields.yearIntroduced }})
                            </h2>
                            <p v-if="item.fields.subtitle">
                                {{ item.fields.subtitle }}
                            </p>
                        </div>
                    </button>
                    <template #body>
                        <div class="flex flex-col gap-8">
                            <img
                                v-if="
                                    item.fields.media?.fields?.file?.url &&
                                    item.fields.media?.fields?.file?.contentType?.startsWith(
                                        'image/'
                                    )
                                "
                                class="w-full"
                                :src="`${
                                    item.fields.media?.fields?.file?.url
                                }?w=300&fit=fill&f=center&fm=webp`"
                                :alt="item.fields.name"
                            />
                            <video
                                v-else-if="
                                    item.fields.media?.fields?.file?.url &&
                                    item.fields.media?.fields?.file?.contentType?.startsWith(
                                        'video/'
                                    )
                                "
                                class="w-full"
                                controls
                                :src="item.fields.media?.fields?.file?.url"
                            />
                            <div
                                v-if="item.fields.ingredients?.length"
                                class="flex flex-col gap-2"
                            >
                                <h2 class="uc-text">Ingredients</h2>
                                <div>
                                    <div
                                        v-for="ingredient in item.fields
                                            .ingredients"
                                        :key="ingredient.value"
                                        class="flex gap-2"
                                    >
                                        <p class="font-bold">
                                            {{ ingredient.key }}
                                        </p>
                                        <p>{{ ingredient.value }}</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="item.fields.instructions"
                                class="flex flex-col gap-2"
                            >
                                <h2 class="uc-text">Instructions</h2>
                                <div>
                                    <rich-text
                                        class="prose-sm prose-stone"
                                        :content="item.fields.instructions"
                                    />
                                </div>
                            </div>
                        </div>
                    </template>
                </u-drawer>
            </u-card>
        </masonry-wall>
    </div>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
useHead({
    title: 'Recipes - Been Coffee Staff Dashboard'
})

const selectedCategory = ref<string | null>('all')

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'recipe',
    lazy: true,
    server: false,
    watch: [selectedCategory],
    immediate: true,
    params: computed(() => ({
        content_type: 'recipe',
        order: '-sys.createdAt',
        include: 1,
        'fields.category.sys.id':
            selectedCategory.value && selectedCategory.value !== 'all'
                ? selectedCategory.value
                : undefined,
        limit: 100
    }))
})

const { data: cats } = useFetch('/api/contentful/fetch-entries', {
    key: 'recipeCategories',
    lazy: true,
    server: false,
    params: computed(() => ({
        content_type: 'recipeCategories',
        order: '-sys.createdAt',
        include: 1,
        limit: 100
    }))
})

// assuming cats: Ref<{ items: TypeRecipeCategory[] } | null>
const categoryOptions = computed<SelectItem[]>(() => {
    return cats.value?.items
        .map((cat: TypeRecipeCategory) => ({
            label: cat.fields.title,
            value: cat.sys.id
        }))
        .concat([{ label: 'All', value: 'all' }])
})

const recipes: ComputedRef<TypeRecipe[] | null> = computed(() => {
    return data.value?.items ?? null
})
</script>
