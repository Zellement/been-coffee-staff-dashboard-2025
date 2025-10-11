<template>
    <div class="p-default">
        <div class="grid grid-cols-4 gap-4">
            <u-card
                :ui="{
                    root: `text-center ${getColourUrgent(tasksOverdueToday)}`
                }"
                variant="solid"
            >
                <h2 class="uc-text flex flex-col items-center">
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
                <h2 class="uc-text flex flex-col items-center">
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
                <h2 class="uc-text flex flex-col items-center">
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
                <h2 class="uc-text flex flex-col items-center">
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

// const outstandingDailyTasks = computed(() => {
//     if (tasksStore?.totalDailyTaskInstances) {
//         return (
//             tasksStore?.totalDailyTaskInstances -
//             tasksStore.taskCountCompletedToday
//         )
//     } else {
//         return 0
//     }
// })

const outstandingRoutineTasks = computed(() => {
    return tasksStore?.overdueTasks.length + tasksStore?.newTasks.length
})

const todaysOrders = computed(() => {
    return ordersStore.todaysOrders.length || 0
})

const totalBookingsToday = computed(() => {
    return tableBookingsStore.tableBookingsForToday?.length || 0
})

const getColour = (value: number) => {
    if (value === 0)
        return 'text-green-600 dark:text-green-400 bg-gradient-to-br from-green-50 to-green-100 !border-green-200'
    if (value < 5)
        return 'text-yellow-600 dark:text-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 !border-yellow-200'
    return 'text-red-600 dark:text-red-400 bg-gradient-to-br from-red-50 to-red-100 !border-red-200'
}

const getColourUrgent = (value: number) => {
    if (value === 0)
        return 'text-green-600 dark:text-green-400 bg-gradient-to-br from-green-50 to-green-100 !border-green-200'
    return 'text-red-600 dark:text-red-400 bg-gradient-to-br from-red-100 to-red-200 !border-red-200'
}
</script>
