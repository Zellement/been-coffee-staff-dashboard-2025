<template>
    <div v-if="hasTableBookings" class="p-c-default">
        <carousel-title-and-action title="Table bookings" />
        <div class="relative">
            <transition name="fade">
                <div v-if="hasTableBookings" class="min-w-0 flex-1 flex gap-4">
                    <u-carousel
                        v-if="allTableBookings"
                        v-slot="{ item }"
                        drag-free
                        :items="allTableBookings"
                        auto-height
                        :ui="{
                            root: 'flex',
                            container: 'items-stretch h-full',
                            item: 'basis-48'
                        }"
                    >
                        <card-table-booking :item="item" />
                    </u-carousel>
                </div>
            </transition>
            <transition name="fade-absolute">
                <div
                    v-if="!hasTableBookings"
                    class="flex w-full gap-4 overflow-hidden"
                >
                    <u-skeleton class="h-17 w-17 shrink-0 rounded-full" />
                    <u-skeleton
                        v-for="i in 6"
                        :key="i"
                        class="h-16 shrink-0 basis-48"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
const tableBookingsStore = useTableBookingsStore()
const locationsStore = useLocationsStore()

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
)

const allTableBookings: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    return tableBookingsStore.allTableBookings
})

const hasTableBookings: ComputedRef<boolean> = computed(() => {
    return !!allTableBookings.value && allTableBookings.value.length > 0
})

const now = new Date()

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'tableBookings',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'tableBooking',
        'fields.dateTime[gte]': now.toISOString(),
        order: 'fields.dateTime',
        'fields.location.sys.id': activeLocationId.value
    }))
})

watch(data, (newData) => {
    if (newData) {
        tableBookingsStore.allTableBookings = newData.items
    }
})
</script>
