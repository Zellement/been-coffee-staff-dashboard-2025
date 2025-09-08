<template>
    <div class="grid grid-cols-4">
        <u-card
            :ui="{
                root: 'text-center'
            }"
        >
            <h2 class="uc-text flex flex-col items-center">
                <span class="text-[0.7em]">Outstanding</span>
                Dailys tasks
            </h2>
            <p class="text-3xl">
                {{
                    tasksStore?.totalDailyTaskInstances
                        ? tasksStore?.totalDailyTaskInstances -
                          tasksStore.taskCountCompletedToday
                        : 'N / A'
                }}
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
            <p class="text-3xl">
                {{
                    tasksStore?.totalDailyTaskInstances
                        ? tasksStore?.totalDailyTaskInstances -
                          tasksStore.taskCountCompletedToday
                        : 'N / A'
                }}
            </p>
        </u-card>
    </div>
</template>

<script lang="ts" setup>
const tasksStore = useTasksStore()
</script>
