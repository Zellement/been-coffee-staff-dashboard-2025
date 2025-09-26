<template>
    <div v-if="hasWinners" class="p-default mb-8">
        <carousel-title-and-action title="Been Awesome Winners">
            <u-button
                size="2xs"
                :label="
                    beenAwesomeStore.lastFetched
                        ? shortDateConverter(
                              new Date(beenAwesomeStore.lastFetched)
                          )
                        : 'Refresh'
                "
                trailing-icon="i-bx-refresh"
                variant="outline"
                @click="beenAwesomeStore.clearCache"
            />
        </carousel-title-and-action>
        <u-carousel
            v-slot="{ item, index }"
            dots
            :items="allWinners"
            :ui="{
                root: 'flex',
                container: 'items-center h-full',
                item: 'basis-80'
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
                        }?w=460&h=640&fit=fill&f=face&fm=webp`"
                        :alt="item.fields.name"
                    />
                </div>
            </u-card>
            <u-card v-else variant="subtle">
                <div class="flex w-full flex-col items-center p-5 text-center">
                    <h2 class="uc-text mb-2">
                        {{ item.fields.name }}
                    </h2>
                    <u-button-group>
                        <u-badge
                            variant="outline"
                            size="sm"
                            color="tertiary"
                            icon="i-bx-log-in"
                            :label="
                                item.fields.from
                                    ? `${new Date(
                                          item.fields.from
                                      ).toLocaleDateString(undefined, {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                      })}`
                                    : 'Start date unknown'
                            "
                        />
                        <u-badge
                            variant="outline"
                            size="sm"
                            color="tertiary"
                            trailing-icon="i-bx-log-out"
                            :ui="{
                                trailingIcon: 'rotate-180'
                            }"
                            :label="
                                fullDateConverter(
                                    getFollowingWinnersStartDate(index)
                                )
                            "
                        />
                    </u-button-group>

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
const beenAwesomeStore = useBeenAwesomeStore()

const colorMode = useColorMode()

const { fullDateConverter, shortDateConverter } = useDateUtils()

const allWinners: ComputedRef<TypeBeenAwesomeWinner[]> = computed(() => {
    return beenAwesomeStore.cachedBeenAwesomeWinners || []
})

const hasWinners: ComputedRef<boolean> = computed(() => {
    return allWinners.value.length > 0
})

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () =>
        locationsStore.safeToFetchAllData &&
        beenAwesomeStore.cachedBeenAwesomeWinners === null
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

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'beenAwesomeWinners',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'beenAwesomeWinner',
        'fields.location.sys.id': activeLocationId.value,
        order: '-fields.from'
    }))
})

watch(data, (newData) => {
    if (newData) {
        beenAwesomeStore.cachedBeenAwesomeWinners = newData.items || []
        beenAwesomeStore.lastFetched = new Date()
    }
})
</script>
