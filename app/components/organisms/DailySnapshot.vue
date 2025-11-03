<template>
    <div class="p-default">
        <div class="grid grid-cols-5 gap-4">
            <u-card
                :ui="{
                    root: `text-center ${getColour(singleTasksTotal)}`
                }"
                variant="solid"
            >
                <h2
                    :class="getTextColour(singleTasksTotal)"
                    class="uc-text flex flex-col items-center"
                >
                    <span class="text-[0.7em]">To do</span>
                    Single tasks
                </h2>
                <p class="mt-1 text-3xl leading-none">
                    {{ singleTasksTotal }}
                </p>
            </u-card>
            <u-card
                :ui="{
                    root: `text-center ${getColourUrgent(tasksOverdueToday)}`
                }"
                variant="solid"
            >
                <h2
                    :class="getTextColourUrgent(tasksOverdueToday)"
                    class="uc-text flex flex-col items-center"
                >
                    <span class="text-[0.7em]">Overdue</span>
                    Daily tasks
                </h2>
                <p class="mt-1 text-3xl leading-none">
                    {{ tasksOverdueToday }}
                </p>
            </u-card>
            <u-card
                :ui="{
                    root: `text-center ${getColour(outstandingRoutineTasks)}`
                }"
            >
                <h2
                    :class="getTextColour(outstandingRoutineTasks)"
                    class="uc-text flex flex-col items-center"
                >
                    <span class="text-[0.7em]">Outstanding</span>
                    Routine tasks
                </h2>
                <p class="mt-1 text-3xl leading-none">
                    {{ outstandingRoutineTasks }}
                </p>
            </u-card>
            <u-card
                :ui="{
                    root: `text-center ${getColour(todaysOrders)}`
                }"
            >
                <h2
                    :class="getTextColour(todaysOrders)"
                    class="uc-text flex flex-col items-center"
                >
                    <span class="text-[0.7em]">Unchecked</span>
                    Deliveries Today
                </h2>
                <p class="mt-1 text-3xl leading-none">
                    {{ todaysOrders }}
                </p>
            </u-card>
            <u-card
                :ui="{
                    root: `text-center ${getColourUrgent(totalBookingsToday)}`
                }"
            >
                <h2
                    :class="getTextColourUrgent(totalBookingsToday)"
                    class="uc-text flex flex-col items-center"
                >
                    <span class="text-[0.7em]">Today's</span>
                    Table Bookings
                </h2>
                <p class="mt-1 text-3xl leading-none">
                    {{ totalBookingsToday }}
                </p>
            </u-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
const tasksStore = useTasksStore()
const ordersStore = useOrdersStore()
const tableBookingsStore = useTableBookingsStore()
const tasksOverdueToday = computed(() => {
    return tasksStore.tasksOverdueToday
})

const singleTasksTotal: ComputedRef<number> = computed(() => {
    return tasksStore?.totalSingleTasks || 0
})

const outstandingRoutineTasks = computed(() => {
    return tasksStore?.overdueTasks.length + tasksStore?.newTasks.length
})

const todaysOrders = computed(() => {
    return ordersStore.todaysOrders.length || 0
})

const totalBookingsToday = computed(() => {
    return tableBookingsStore.tableBookingsForToday?.length || 0
})

const greenClasses =
    'text-green-600 dark:text-green-400 bg-gradient-to-br from-green-50 to-green-100 !border-green-200 dark:from-green-600 dark:to-green-800 dark:!border-green-700 dark:!text-green-400'
const yellowClasses =
    'text-yellow-600 dark:text-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 !border-yellow-200 dark:from-yellow-600 dark:to-yellow-500 dark:!border-yellow-700 dark:!text-yellow-200'
const redClasses =
    'text-red-600 dark:text-red-400 bg-gradient-to-br from-red-50 to-red-100 !border-red-200 dark:from-red-800 dark:to-red-900 dark:!border-red-700'

const greenTextClasses = 'text-green-800 dark:!text-green-400'
const yellowTextClasses = 'text-yellow-800 dark:!text-yellow-200'
const redTextClasses = '!text-red-800 dark:!text-red-400'

const getColour = (value: number) => {
    if (value === 0) return greenClasses
    if (value < 5) return yellowClasses
    return redClasses
}

const getColourUrgent = (value: number) => {
    if (value === 0) return greenClasses
    return redClasses
}

const getTextColour = (value: number) => {
    if (value === 0) return greenTextClasses
    if (value < 5) return yellowTextClasses
    return redTextClasses
}

const getTextColourUrgent = (value: number) => {
    if (value === 0) return greenTextClasses
    return redTextClasses
}
</script>
