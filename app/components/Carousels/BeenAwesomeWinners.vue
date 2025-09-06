<template>
    <div class="p-default mb-8">
        <carousel-title-and-action title="Been Awesome Winners">
            <u-button
                size="xs"
                icon="i-bx-refresh"
                variant="outline"
                @click="cachedDataStore.clearAllCachedData"
            />
        </carousel-title-and-action>
        <u-carousel
            v-slot="{ item, index }"
            dots
            drag-free
            :items="allWinners"
            :ui="{
                root: 'flex',
                container: 'items-center h-full',
                item: 'ps-2 basis-80'
            }"
        >
            <u-card
                v-if="index === 0"
                variant="solid"
                :ui="{
                    root: 'bg-black dark:bg-white'
                }"
            >
                <div class="flex flex-col items-center p-8">
                    <img
                        src="@/assets/images/beenawesome.png"
                        class="mb-8 w-full max-w-[180px]"
                        :class="
                            colorMode.value === 'dark'
                                ? ''
                                : 'brightness-50 invert'
                        "
                    />
                    <h2 class="uc-text text-lg !text-white dark:!text-black">
                        {{ item.fields.name }}
                    </h2>

                    <p class="flex items-center gap-1">
                        <u-icon name="i-bx-log-in" />
                        {{ fullDateConverter(item.fields.from) }}
                    </p>

                    <img
                        class="mt-8 rounded shadow-xl"
                        :src="`${
                            item.fields.photo?.fields?.file?.url
                        }?w=230&h=320&fit=fill&f=face&fm=webp`"
                        :alt="item.fields.name"
                    />
                </div>
            </u-card>
            <u-card v-else variant="subtle">
                <div class="flex w-full flex-col items-center p-5 text-center">
                    <h2 class="uc-text mb-2">
                        {{ item.fields.name }}
                    </h2>

                    <p class="flex flex-col">
                        <span class="flex items-center gap-2">
                            <u-icon name="i-bx-log-in" />
                            {{ fullDateConverter(item.fields.from) }}
                        </span>
                        <span class="text-tertiary flex items-center gap-2">
                            <u-icon name="i-bx-log-out" />
                            {{
                                fullDateConverter(
                                    getFollowingWinnersStartDate(index)
                                )
                            }}
                        </span>
                    </p>

                    <p class="mt-2">
                        {{
                            duration(
                                getFollowingWinnersStartDate(index),
                                item.fields.from
                            )
                        }}
                        days
                    </p>

                    <img
                        class="mt-4 w-full rounded shadow-xl"
                        :src="`${
                            item.fields.photo?.fields?.file?.url
                        }?w=300&h=370&fit=fill&f=face&fm=webp`"
                        :alt="item.fields.name"
                    />
                </div>
            </u-card>
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()
const cachedDataStore = useCachedDataStore()

const colorMode = useColorMode()

const dataFetched: Ref<boolean> = ref(false)

const { fullDateConverter } = useDateUtils()

const allWinners: ComputedRef<TypeBeenAwesomeWinner[]> = computed(() => {
    return cachedDataStore.cachedBeenAwesomeWinners || []
})

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

const getFollowingWinnersStartDate = (index: number) => {
    return allWinners.value[index - 1]?.fields.from
}

const duration = (to: string, from: string) => {
    const startDate = new Date(from)
    const endDate = new Date(to)
    const months = (endDate.getTime() - startDate.getTime()) / 1000 / 86400
    return months
}

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    key: 'beenAwesomeWinners',
    lazy: true,
    watch: false,
    server: false,
    immediate: false,
    params: computed(() => ({
        content_type: 'beenAwesomeWinner',
        'fields.location.sys.id': activeLocationId.value,
        order: '-fields.from'
    }))
})

watch(
    shouldFetch,
    async (ready) => {
        if (ready) {
            await execute()
            dataFetched.value = true
            cachedDataStore.cachedBeenAwesomeWinners = data.value?.items || []
        }
    },
    { immediate: false }
)

watch(data, (newData) => {
    if (newData) {
        cachedDataStore.cachedBeenAwesomeWinners = newData.items || []
    }
})
</script>
