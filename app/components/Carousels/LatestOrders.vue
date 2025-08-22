<template>
    <div v-if="activeLocationId" class="">
        <h2 class="uppercase">Latest orders</h2>
        <div class="flex gap-4">
            <div v-if="hasSortedRoutineTasks" class="min-w-0 flex-1">
                <u-carousel
                    v-if="sortedRoutineTasks"
                    v-slot="{ item }"
                    :items="sortedRoutineTasks"
                    auto-height
                    :ui="{ item: 'basis-48' }"
                >
                    {{ item.fields.details }}
                </u-carousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const ordersStore = useOrdersStore()

// const { fetchDailyTaskInstances } = useTasksUtils()

const today = new Date()

/* Computed */

const allOrders: ComputedRef<TypeOrder[] | null> = computed(() => {
    return ordersStore.allOrders
})

const sortedRoutineTasks: ComputedRef<TypeOrder[] | null> = computed(() => {
    if (!allOrders.value) return null
    const incompleteToday = allOrders.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() !==
            today.toDateString()
    )
    incompleteToday.sort((a, b) => {
        return a.fields.task.fields.dueByHour - b.fields.task.fields.dueByHour
    })
    const completeToday = allOrders.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() ===
            today.toDateString()
    )
    return [...incompleteToday, ...completeToday]
})

const hasSortedRoutineTasks: ComputedRef<boolean> = computed(() => {
    return !!sortedRoutineTasks.value && sortedRoutineTasks.value.length > 0
})

const locationsStore = useLocationsStore()

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const { data } = useFetch('/api/contentful/fetch-entries', {
    params: computed(() => ({
        content_type: 'order',
        'fields.location.sys.id': activeLocationId.value
    }))
})

watch(
    data,
    (newData) => {
        if (newData) {
            // console.log('Daily tasks data updated:', newData)
            ordersStore.allOrders = newData.items
            ordersStore.totalOrders = newData.total
        }
    },
    { immediate: true }
)
</script>
