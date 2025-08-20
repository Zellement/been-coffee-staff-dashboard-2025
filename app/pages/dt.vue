<template>
    <div class="page">
        <h1 class="mb-20 text-2xl">Daily tasks</h1>

        <!-- Circular Progress -->
        <div class="flex gap-2">
            <div class="relative flex w-20 shrink-0 grow-0">
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
            <div v-if="hasDailyTasks" class="grow">
                <u-carousel
                    v-if="allDailyTasks"
                    v-slot="{ item }"
                    :items="allDailyTasks"
                    :ui="{ item: 'basis-56' }"
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

// const { fullDateConverter } = useDateUtils()

const { fetchDailyTasks } = useDailyTasksUtils()

const hasDailyTasks: ComputedRef<boolean> = computed(() => {
    return !!allDailyTasks.value && allDailyTasks.value.length > 0
})

fetchDailyTasks()
</script>
