<template>
    <div class="page p-default grid grid-cols-12 gap-4">
        <u-card
            v-for="recipe in recipes?.items"
            :key="recipe.sys.id"
            class="col-span-full flex md:col-span-4 xl:col-span-3"
        >
            <u-drawer
                :title="recipe.fields.title"
                :description="recipe.fields.subtitle ?? ''"
                direction="left"
            >
                <button class="flex h-full flex-col items-start gap-2">
                    <img
                        v-if="recipe.fields.media?.fields?.file?.url"
                        class="w-full"
                        :src="`${
                            recipe.fields.media?.fields?.file?.url
                        }?w=300&fit=fill&f=center&fm=webp`"
                        :alt="recipe.fields.name"
                    />
                    <div
                        v-else
                        class="dark:bg-navy-500 h-[200px] w-[300px] bg-gray-200"
                    />
                    <div class="flex flex-col items-start">
                        <h2 class="uc-text">
                            {{ recipe.fields.title }}
                            ({{ recipe.fields.yearIntroduced }})
                        </h2>
                        <p v-if="recipe.fields.subtitle">
                            {{ recipe.fields.subtitle }}
                        </p>
                    </div>
                </button>
                <template #body>
                    <div class="flex flex-col gap-8">
                        <div class="flex flex-col gap-2">
                            <h2 class="uc-text">Ingredients</h2>
                            <div>
                                <div
                                    v-for="ingredient in recipe.fields
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
                                    :content="recipe.fields.instructions"
                                />
                            </div>
                        </div>
                    </div>
                </template>
            </u-drawer>
        </u-card>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'Recipes - Been Coffee Staff Dashboard'
})

/* Functions & lifecycle */

const { data: recipes } = useFetch('/api/contentful/fetch-entries', {
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
</script>
