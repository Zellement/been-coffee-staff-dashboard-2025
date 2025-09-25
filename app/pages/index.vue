<template>
    <div class="page grid grid-cols-12 gap-4">
        <div class="fixed inset-0 z-10 bg-red-900">{{ data }}</div>
        <daily-tasks class="col-span-full md:col-span-6" />
        <routine-tasks class="col-span-full md:col-span-6" />
        <upcoming-deliveries class="col-span-full" />
        <table-bookings v-show="hasTableBookings" class="col-span-full" />
        <notice-board class="col-span-full" />
        <reviews-listings class="col-span-full" />
        <standing-orders class="col-span-full" />
        <been-awesome-winners class="col-span-full" />
        <location-team class="col-span-full" />
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'Been Coffee Staff Dashboard'
})

const { data } = await useFetch('/api/rotaready/get-staff')

const tableBookingsStore = useTableBookingsStore()

const hasTableBookings = computed(() => {
    return (
        !!tableBookingsStore?.allTableBookings &&
        tableBookingsStore?.allTableBookings?.length > 0
    )
})
</script>
