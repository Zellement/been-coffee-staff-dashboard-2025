<template>
    <div class="p-default">
        <div class="grid grid-cols-4 gap-4">
            <u-card
                :ui="{
                    root: 'text-center'
                }"
            >
                <h2 class="uc-text flex flex-col items-center">
                    <span class="text-[0.7em]">Outstanding</span>
                    Dailys tasks
                </h2>
                <p class="text-3xl" :class="getColour(outstandingDailyTasks)">
                    {{ outstandingDailyTasks }}
                </p>
            </u-card>
            <u-card
                :ui="{
                    root: 'text-center'
                }"
            >
                <h2 class="uc-text flex flex-col items-center">
                    <span class="text-[0.7em]">Outstanding</span>
                    Routine tasks
                </h2>
                <p class="text-3xl" :class="getColour(outstandingRoutineTasks)">
                    {{ outstandingRoutineTasks }}
                </p>
            </u-card>
            <u-card
                :ui="{
                    root: 'text-center'
                }"
            >
                <h2 class="uc-text flex flex-col items-center">
                    <span class="text-[0.7em]">Unchecked</span>
                    Deliveries Today
                </h2>
                <p class="text-3xl" :class="getColour(todaysOrders)">
                    {{ todaysOrders }}
                </p>
            </u-card>
            <u-card
                :ui="{
                    root: 'text-center'
                }"
            >
                <h2 class="uc-text flex flex-col items-center">
                    <span class="text-[0.7em]">Today's</span>
                    Table Bookings
                </h2>
                <p class="text-3xl" :class="getColour(totalBookingsToday)">
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

const outstandingDailyTasks = computed(() => {
    if (tasksStore?.totalDailyTaskInstances) {
        return (
            tasksStore?.totalDailyTaskInstances -
            tasksStore.taskCountCompletedToday
        )
    } else {
        return 0
    }
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

const getColour = (value: number) => {
    if (value === 0) return 'text-green-600 dark:text-green-400'
    if (value < 5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
}
</script>
