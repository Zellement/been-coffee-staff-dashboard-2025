<template>
    <div class="page grid grid-cols-12 gap-4">
        <div
            class="overflow-y fixed inset-0 z-[9999] h-dvh bg-red-900 text-white"
        >
            <div class="h-full overflow-y-auto">
                <div v-for="item in shiftsToday?.shifts" :key="item.id">
                    {{ item.userName }}
                    <time>{{ new Date(item.start).toLocaleTimeString() }}</time>
                </div>
                <pre
                    v-if="shiftsTomorrow"
                ><p v-for="item in shiftsTomorrow?.shifts" :key="item.id">{{ item.userName }}</p></pre>
                <pre class="overflow-y">{{ shiftsToday }}</pre>
            </div>
        </div>
        <keep-alive><daily-tasks class="col-span-full" /></keep-alive>
        <keep-alive><routine-tasks class="col-span-full" /></keep-alive>
        <keep-alive><upcoming-deliveries class="col-span-full" /></keep-alive>
        <keep-alive
            ><table-bookings v-show="hasTableBookings" class="col-span-full"
        /></keep-alive>
        <keep-alive><notice-board class="col-span-full" /></keep-alive>
        <keep-alive><reviews-listings class="col-span-full" /></keep-alive>
        <keep-alive><standing-orders class="col-span-full" /></keep-alive>
        <keep-alive><been-awesome-winners class="col-span-full" /></keep-alive>
        <keep-alive><location-team class="col-span-full" /></keep-alive>
        <keep-alive><leadership-team class="col-span-full" /></keep-alive>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'Been Coffee Staff Dashboard'
})

const { data: shiftsToday } = await useFetch('/api/rotaready/get-shifts', {
    params: {
        startDateMin: '2025-10-20',
        startDateMax: '2025-10-21',
        endDateMin: '2025-10-20',
        endDateMax: '2025-10-21'
    }
})

const { data: shiftsTomorrow } = await useFetch('/api/rotaready/get-shifts', {
    params: {
        startDateMin: '2025-10-21',
        startDateMax: '2025-10-22',
        endDateMin: '2025-10-21',
        endDateMax: '2025-10-22'
    }
})

const tableBookingsStore = useTableBookingsStore()

const hasTableBookings = computed(() => {
    return (
        !!tableBookingsStore?.allTableBookings &&
        tableBookingsStore?.allTableBookings?.length > 0
    )
})
</script>
