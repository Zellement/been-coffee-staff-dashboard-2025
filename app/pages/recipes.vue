<template>
    <div class="page p-default gap-4">
        <u-select
            v-model="selectedCategory"
            label="Filter by category"
            :items="categoryOptions"
            class="mb-2 w-full max-w-40"
        />

        <!-- Cross-fade the whole grid when the category changes -->
        <Transition name="fade-scale" mode="out-in">
            <!-- Use the category as a key to trigger the transition -->
            <div :key="selectedCategory ?? 'all'">
                <!-- Loading skeleton (masonry-like) -->
                <div
                    v-if="loading"
                    class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                >
                    <div
                        v-for="n in 8"
                        :key="n"
                        class="dark:bg-navy-600 h-[220px] w-full animate-pulse rounded-xl bg-gray-200"
                    />
                </div>

                <!-- Real grid -->
                <masonry-wall
                    v-else
                    v-slot="{ item }"
                    :items="recipes || []"
                    :column-width="200"
                    :gap="16"
                >
                    <u-card
                        :key="item.sys.id"
                        :ui="{ body: 'w-full' }"
                        class="card-enter flex w-full"
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
                                    :src="`${item.fields.media?.fields?.file?.url}?w=300&fit=fill&f=center&fm=webp`"
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
                                        {{ item.fields.title }} ({{
                                            item.fields.yearIntroduced
                                        }})
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
                                            item.fields.media?.fields?.file
                                                ?.url &&
                                            item.fields.media?.fields?.file?.contentType?.startsWith(
                                                'image/'
                                            )
                                        "
                                        class="block h-full max-h-[40dvh] w-auto self-start"
                                        :src="`${item.fields.media?.fields?.file?.url}?w=300&fit=fill&f=center&fm=webp`"
                                        :alt="item.fields.name"
                                    />
                                    <video
                                        v-else-if="
                                            item.fields.media?.fields?.file
                                                ?.url &&
                                            item.fields.media?.fields?.file?.contentType?.startsWith(
                                                'video/'
                                            )
                                        "
                                        class="h-full max-h-[85dvh] w-full"
                                        controls
                                        :src="
                                            item.fields.media?.fields?.file?.url
                                        "
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
                                                :content="
                                                    item.fields.instructions
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </u-drawer>
                    </u-card>
                </masonry-wall>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

useHead({ title: 'Recipes - Been Coffee Staff Dashboard' })

const selectedCategory = ref<string | null>('all')

const { data, pending } = useFetch('/api/contentful/fetch-entries', {
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
    immediate: true,
    params: {
        content_type: 'recipeCategories',
        order: '-sys.createdAt',
        include: 1,
        limit: 100
    }
})

const loading = computed(() => pending.value)

const categoryOptions = computed<SelectItem[]>(() => {
    const base = (cats.value?.items ?? []).map((cat: TypeRecipeCategory) => ({
        label: cat.fields.title,
        value: cat.sys.id
    }))
    return [{ label: 'All categories', value: 'all' }, ...base]
})

const recipes: ComputedRef<TypeRecipe[] | null> = computed(
    () => data.value?.items ?? null
)
</script>

<style scoped>
/* Cross-fade + subtle scale for whole grid */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition:
        opacity 180ms ease,
        transform 220ms ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

/* Slight slide/fade on individual cards (applied via .card-enter class) */
.card-enter {
    opacity: 0;
    transform: translateY(6px);
    animation: cardIn 220ms ease forwards;
}
@keyframes cardIn {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
