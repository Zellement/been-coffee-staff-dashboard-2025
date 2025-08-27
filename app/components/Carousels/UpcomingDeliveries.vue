<template>
    <div class="p-default">
        <h2 class="uc-text uc-text--xs">Deliveries</h2>
        <div v-if="dataFetched" class="flex gap-4">
            <div class="min-w-0 flex-1">
                <u-carousel
                    v-if="sortedRoutineTaskInstances"
                    v-slot="{ item }"
                    :items="sortedRoutineTaskInstances"
                    auto-height
                    :ui="{ item: 'basis-48' }"
                >
                    <card-order :item="item" />
                </u-carousel>
            </div>
        </div>
        <div v-else class="flex w-full gap-4 overflow-hidden">
            <u-skeleton
                v-for="i in 6"
                :key="i"
                class="h-17 shrink-0 basis-48"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const locationsStore = useLocationsStore()

const dataFetched: Ref<boolean> = ref(false)
const orders: Ref<TypeOrder[]> = ref([])

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => !!activeLocationId.value
)

const today = new Date()
today.setHours(0, 0, 0, 0)

const sortedRoutineTaskInstances: ComputedRef<TypeDailyTask[] | null> =
    computed(() => {
        return [
            ...todaysOrders.value,
            ...overdueOrders.value,
            ...remainingOrders.value
        ]
    })

const remainingOrders: ComputedRef<TypeOrder[]> = computed(() => {
    if (!orders.value) return []
    // All orders that are left that are not in todaysOrders nor overdueOrders
    return orders.value.filter((task: TypeOrder) => {
        return task.fields.deliveryCheckedBy && task.fields.deliveryCheckedAt
    })
})

const todaysOrders: ComputedRef<TypeOrder[]> = computed(() => {
    if (!orders.value) return []
    return orders.value
        .filter((task: TypeOrder) => {
            const dDate = new Date(task.fields.expectedDeliveryDate)
            dDate.setHours(0, 0, 0, 0)
            return (
                !task.fields.deliveryCheckedBy &&
                !task.fields.deliveryCheckedAt &&
                dDate.getTime() === today.getTime()
            )
        })
        .map((task: TypeOrder) => ({
            ...task
        }))
})

const overdueOrders: ComputedRef<TypeOrder[]> = computed(() => {
    if (!orders.value) return []
    return orders.value
        .filter((task: TypeOrder) => {
            const dDate = new Date(task.fields.expectedDeliveryDate)
            dDate.setHours(0, 0, 0, 0)
            return (
                !task.fields.deliveryCheckedBy &&
                !task.fields.deliveryCheckedAt &&
                dDate.getTime() < today.getTime()
            )
        })
        .map((task: TypeOrder) => ({
            ...task
        }))
})

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    params: computed(() => ({
        content_type: 'order',
        'fields.location.sys.id': activeLocationId.value,
        order: 'fields.expectedDeliveryDate',
        limit: 20
    })),
    immediate: false
})

watch(
    shouldFetch,
    (ready) => {
        if (ready) {
            execute().then(() => {
                dataFetched.value = true
                orders.value = data.value?.items || []
            })
        }
    },
    { immediate: true }
)

watch(data, (newData) => {
    if (newData) {
        orders.value = newData.items || []
    }
})
</script>
