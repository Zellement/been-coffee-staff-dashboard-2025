<template>
    <div class="page">
        <h1 class="mb-20 text-2xl">Daily tasks</h1>

        <!-- Circular Progress -->
        <div class="flex gap-4">
            <div class="relative flex w-20">
                <progress-bar-circular
                    v-if="totalDailyTasks"
                    class="my-auto"
                    :total-items="totalDailyTasks"
                    :completed-items="
                        allDailyTasks?.filter(
                            (task) => task.fields.lastCompleted
                        ).length || 0
                    "
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

const allDailyTasks: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    return dailyTasksStore.allDailyTasks
})

const totalDailyTasks: ComputedRef<number | null> = computed(() => {
    return dailyTasksStore.totalDailyTasks
})

const sortedDailyTasks: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    if (!allDailyTasks.value) return null
    const incomplete = allDailyTasks.value.filter(
        (task) => !task.fields.lastCompleted
    )
    const complete = allDailyTasks.value.filter(
        (task) => task.fields.lastCompleted
    )
    return [...incomplete, ...complete]
})

// const { fullDateConverter } = useDateUtils()

const { fetchDailyTasks } = useDailyTasksUtils()

const hasSortedDailyTasks: ComputedRef<boolean> = computed(() => {
    return !!sortedDailyTasks.value && sortedDailyTasks.value.length > 0
})

fetchDailyTasks()
</script>
