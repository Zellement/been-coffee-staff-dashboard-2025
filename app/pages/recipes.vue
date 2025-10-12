<template>
    <div class="page p-default gap-4">
        <masonry-wall
            v-slot="{ item }"
            :items="recipes || []"
            :column-width="300"
            :gap="16"
        >
            <u-card
                :key="item.sys.id"
                class="col-span-full flex md:col-span-4 xl:col-span-3"
            >
                <u-drawer
                    :title="item.fields.title"
                    :description="item.fields.subtitle ?? ''"
                    direction="left"
                >
                    <button class="flex h-full flex-col items-start gap-2">
                        <img
                            v-if="item.fields.media?.fields?.file?.url"
                            class="w-full"
                            :src="`${
                                item.fields.media?.fields?.file?.url
                            }?w=300&fit=fill&f=center&fm=webp`"
                            :alt="item.fields.name"
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
                            <div class="flex flex-col gap-2">
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
                            <div class="flex flex-col gap-2">
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
useHead({
    title: 'Recipes - Been Coffee Staff Dashboard'
})

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'recipe',
    lazy: true,
    server: false,
    params: computed(() => ({
        content_type: 'recipe',
        order: '-sys.createdAt',
        include: 1,
        limit: 100
    }))
})

const recipes: ComputedRef<TypeRecipe[] | null> = computed(() => {
    return data.value?.items ?? null
})
</script>
