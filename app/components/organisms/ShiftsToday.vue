<template>
    <div class="p-default">
        <div class="flex flex-col gap-1">
            <div v-for="item in shiftsToday?.shifts" :key="item.id">
                <single-shift :shift="item" />
            </div>
        </div>
        <!-- <pre>{{ shiftsToday }}</pre> -->
    </div>
</template>

<script lang="ts" setup>
const { data: shiftsToday } = await useFetch('/api/rotaready/get-shifts', {
    params: {
        startDateMin: '2025-10-20',
        startDateMax: '2025-10-21',
        endDateMin: '2025-10-20',
        endDateMax: '2025-10-21'
    }
})
</script>
