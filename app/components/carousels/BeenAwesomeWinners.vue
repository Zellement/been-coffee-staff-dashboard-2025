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
            <been-awesome-current-winner v-if="index === 0" :winner="item" />
            <been-awesome-previous-winner
                v-else
                :winner="item"
                :all-winners="allWinners"
                :index="index"
            />
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()
const beenAwesomeStore = useBeenAwesomeStore()

const { shortDateConverter } = useDateUtils()

const allWinners: ComputedRef<TypeBeenAwesomeWinner[]> = computed(() => {
    return beenAwesomeStore.beenAwesomeWinnersLastFive || []
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

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'beenAwesomeWinners',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'beenAwesomeWinner',
        select: 'fields.details,fields.from,fields.name,fields.photo',
        'fields.location.sys.id': activeLocationId.value,
        order: '-fields.from',
        limit: 100
    }))
})

watch(data, (newData) => {
    if (newData) {
        beenAwesomeStore.cachedBeenAwesomeWinners = newData.items || []
        beenAwesomeStore.lastFetched = new Date()
    }
})
</script>
