<template>
    <div class="">
        <h1 class="uppercase">Daily tasks</h1>
        <div class="flex gap-4">
            <div class="relative flex w-16 flex-col text-center">
                <progress-bar-circular
                    v-if="totalDailyTasks"
                    class="my-auto"
                    :total-items="totalDailyTasks"
                    :completed-items="taskCountCompletedToday"
                />
            </div>
            <div v-if="hasSortedDailyTasks" class="min-w-0 flex-1">
                <u-carousel
                    v-if="sortedDailyTasks"
                    v-slot="{ item }"
                    :items="sortedDailyTasks"
                    :ui="{ item: 'basis-48' }"
                >
                    <single-daily-task-card :item="item" />
                </u-carousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const dailyTasksStore = useDailyTasksStore()

const { fetchDailyTasks } = useDailyTasksUtils()

const today = new Date()

/* Computed */

const allDailyTasks: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    return dailyTasksStore.allDailyTasks
})

const sortedDailyTasks: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    if (!allDailyTasks.value) return null
    const incompleteToday = allDailyTasks.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() !==
            today.toDateString()
    )
    incompleteToday.sort((a, b) => {
        return a.fields.dueByHour - b.fields.dueByHour
    })
    const completeToday = allDailyTasks.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() ===
            today.toDateString()
    )
    return [...incompleteToday, ...completeToday]
})

const hasSortedDailyTasks: ComputedRef<boolean> = computed(() => {
    return !!sortedDailyTasks.value && sortedDailyTasks.value.length > 0
})

const totalDailyTasks: ComputedRef<number | null> = computed(() => {
    return dailyTasksStore.totalDailyTasks
})

const taskCountCompletedToday: ComputedRef<number> = computed(() => {
    return (
        allDailyTasks.value?.filter((task) => {
            const lastCompleted = task.fields.lastCompleted
            if (!lastCompleted) return false
            const lastCompletedDate = new Date(lastCompleted)
            return lastCompletedDate.toDateString() === today.toDateString()
        }).length || 0
    )
})

fetchDailyTasks()
</script>
