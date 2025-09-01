<template>
    <div class="p-default mb-8">
        <div class="flex items-center justify-between">
            <h2 class="uc-text uc-text--carousel-title">
                Been Awesome Winners
            </h2>
            <u-button
                size="xs"
                icon="i-bx-refresh"
                variant="outline"
                @click="cachedDataStore.clearAllCachedData"
            />
        </div>
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center">
            <u-card
                class="lg:shrink-0 lg:basis-[300px]"
                variant="solid"
                :ui="{
                    root: 'bg-black dark:bg-white'
                }"
            >
                <div class="flex flex-col items-center py-8">
                    <img
                        src="@/assets/images/beenawesome.png"
                        class="mb-8 w-full max-w-[180px]"
                    />
                    <h2 class="uc-text text-lg !text-white dark:!text-black">
                        {{ currentWinner.fields.name }}
                    </h2>

                    <p>
                        Since {{ fullDateConverter(currentWinner.fields.from) }}
                    </p>

                    <img
                        class="mt-8 rounded shadow-xl"
                        :src="`${
                            currentWinner.fields.photo?.fields?.file?.url
                        }?w=230&h=320&fit=fill&f=face&fm=webp`"
                        :alt="currentWinner.fields.name"
                    />
                </div>
            </u-card>
            <div class="lg:min-w-0 lg:flex-1">
                <u-carousel
                    v-slot="{ item }"
                    dots
                    drag-free
                    :items="previousWinners"
                    :ui="{
                        root: 'flex',
                        container: 'items-stretch h-full',
                        item: 'h-full flex basis-3/4 sm:basis-[280px]'
                    }"
                >
                    <u-card
                        :ui="{
                            root: 'h-full flex w-full justify-center'
                        }"
                        variant="subtle"
                    >
                        <div class="flex w-full flex-col items-center py-4">
                            <h2 class="uc-text">
                                {{ item.fields.name }}
                            </h2>

                            <p>
                                From
                                {{ fullDateConverter(item.fields.from) }}
                            </p>

                            <img
                                class="mt-8 rounded shadow-xl"
                                :src="`${
                                    item.fields.photo?.fields?.file?.url
                                }?w=180&h=250&fit=fill&f=face&fm=webp`"
                                :alt="item.fields.name"
                            />
                        </div>
                    </u-card>
                </u-carousel>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()
const cachedDataStore = useCachedDataStore()

const dataFetched: Ref<boolean> = ref(false)

const { fullDateConverter } = useDateUtils()

const allWinners: ComputedRef<TypeBeenAwesomeWinner[]> = computed(() => {
    return cachedDataStore.cachedBeenAwesomeWinners || []
})

const previousWinners: ComputedRef<TypeBeenAwesomeWinner[]> = computed(() => {
    return allWinners.value.slice(1)
})

const currentWinner: ComputedRef<TypeBeenAwesomeWinner | undefined> = computed(
    () => {
        return allWinners.value[0]
    }
)

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () =>
        !!activeLocationId.value &&
        cachedDataStore.cachedBeenAwesomeWinners === null
)

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    key: 'beenAwesomeWinners',
    lazy: true,
    server: false,
    params: computed(() => ({
        content_type: 'beenAwesomeWinner',
        'fields.location.sys.id': activeLocationId.value,
        order: '-fields.from'
    })),
    immediate: false
})

watch(
    shouldFetch,
    (ready) => {
        if (ready) {
            execute().then(() => {
                console.log('Fetched Been Awesome winners:', data.value?.items)
                dataFetched.value = true
                cachedDataStore.cachedBeenAwesomeWinners =
                    data.value?.items || []
            })
        }
    },
    { immediate: true }
)

watch(data, (newData) => {
    if (newData) {
        cachedDataStore.cachedBeenAwesomeWinners = newData.items || []
    }
})
</script>
