<template>
    <div class="page grid grid-cols-12 gap-4">
        <keep-alive><shifts-today class="col-span-full" /></keep-alive>
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

const tableBookingsStore = useTableBookingsStore()

const hasTableBookings = computed(() => {
    return (
        !!tableBookingsStore?.allTableBookings &&
        tableBookingsStore?.allTableBookings?.length > 0
    )
})
</script>
