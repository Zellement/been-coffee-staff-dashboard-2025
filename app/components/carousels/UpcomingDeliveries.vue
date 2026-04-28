<template>
    <div v-if="ordersStore.allOrders === null || hasOrders" class="p-c-default">
        <carousel-title-and-action title="Deliveries">
            <span class="flex items-center gap-2">
                <u-button
                    size="2xs"
                    color="tertiary"
                    :ui="{
                        base: 'p-1.5 leading-none'
                    }"
                    @click="refreshOrders"
                >
                    Refresh
                </u-button>
                <u-badge
                    v-if="ordersStore.lastFetched"
                    size="xs"
                    :ui="{
                        base: 'p-1.5 leading-none'
                    }"
                    variant="outline"
                >
                    {{
                        useDateFormat(
                            ordersStore.lastFetched,
                            'ddd DD MMM HH:mm:ss'
                        )
                    }}
                </u-badge>
            </span>
        </carousel-title-and-action>
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
                            :orientation="carouselOrientation"
                            :ui="carouselUi"
                        >
                            <card-order :item="item" />
                        </u-carousel>
                    </div>
                </div>
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop v-if="ordersStore.allOrders === null" />
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
interface Props {
    carouselOrientation?: 'horizontal' | 'vertical'
}

const props = defineProps<Props>()
const locationsStore = useLocationsStore()
const ordersStore = useOrdersStore()

const orders: ComputedRef<TypeOrder[] | null> = computed(() => {
    return ordersStore.allOrders
})

const carouselUi = computed(() => {
    return props.carouselOrientation === 'vertical'
        ? {
              item: 'w-full basis-20',
              container: 'h-100'
          }
        : {
              item: 'basis-48'
          }
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

const { data, refresh } = useFetch('/api/contentful/fetch-entries', {
    key: 'orders',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'order',
        'fields.location.sys.id': activeLocationId.value,
        order: '-fields.expectedDeliveryDate',
        limit: 12
    }))
})

watch(data, (newData: any) => {
    if (newData) {
        ordersStore.allOrders = newData.items || []
        ordersStore.lastFetched = new Date()
    }
})

const refreshOrders = async (): Promise<void> => {
    ordersStore.clearCache()
    await refresh()
}
</script>
