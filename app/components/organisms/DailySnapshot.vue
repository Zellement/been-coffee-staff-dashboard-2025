<template>
    <div class="">
        {{
            tasksStore?.totalDailyTaskInstances
                ? tasksStore?.totalDailyTaskInstances -
                  tasksStore.taskCountCompletedToday
                : 'N / A'
        }}
    </div>
</template>

<script lang="ts" setup>
const tasksStore = useTasksStore()
</script>
