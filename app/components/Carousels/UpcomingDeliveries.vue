<template>
    <div class="p-c-default">
        <carousel-title-and-action title="Deliveries" />
        <div class="relative">
            <transition name="fade">
                <div v-if="hasOrders" class="flex gap-4">
                    <div class="min-w-0 flex-1">
                        <u-carousel
                            v-if="sortedRoutineTaskInstances"
                            v-slot="{ item }"
                            :items="sortedRoutineTaskInstances"
                            auto-height
                            drag-free
                            :ui="{ item: 'basis-48' }"
                        >
                            <card-order :item="item" />
                        </u-carousel>
                    </div>
                </div>
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop v-if="!hasOrders" />
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
const locationsStore = useLocationsStore()
const ordersStore = useOrdersStore()

const orders: ComputedRef<TypeOrder[] | null> = computed(() => {
    return ordersStore.allOrders
})

/* Computed */

const hasOrders: ComputedRef<boolean> = computed(() => {
    return !!orders.value && orders.value.length > 0
})

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
)

const sortedRoutineTaskInstances: ComputedRef<TypeDailyTask[] | null> =
    computed(() => {
        return [
            ...ordersStore.todaysOrders,
            ...ordersStore.overdueOrders,
            ...ordersStore.upcomingOrders,
            ...ordersStore.completedOrders
        ]
    })

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'orders',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: true,
    params: computed(() => ({
        content_type: 'order',
        'fields.location.sys.id': activeLocationId.value,
        order: 'fields.expectedDeliveryDate',
        limit: 20
    }))
})

watch(data, (newData) => {
    if (newData) {
        ordersStore.allOrders = newData.items || []
    }
})
</script>
