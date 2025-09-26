<template>
    <div class="page grid grid-cols-12 gap-4">
        <daily-tasks hide-progress-circle class="col-span-full" />
        <routine-tasks hide-progress-circle class="col-span-full" />
        <upcoming-deliveries
            :class="hasTableBookings ? 'col-span-6' : 'col-span-full'"
        />
        <table-bookings v-show="hasTableBookings" class="col-span-6" />
        <notice-board class="col-span-full" />
        <reviews-listings class="col-span-full" />
        <standing-orders class="col-span-6" />
        <div class="col-span-6 flex gap-4">
            <single-day-dot :days-plus="2" title="+ 3 Days" />
            <single-day-dot :days-plus="4" title="+ 5 Days" />
            <single-day-dot :days-plus="6" title="+ 7 Days" />
            <single-day-dot :days-plus="13" title="+ 14 Days" />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dash'
})

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
