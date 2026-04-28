<template>
    <div class="page grid grid-cols-12 gap-4">
        <lazy-single-tasks class="col-span-full" />
        <lazy-shifts-carousel
            class="col-span-full mb-8"
            item-classes="md:basis-1/2"
        />
        <lazy-daily-tasks
            carousel-orientation="vertical"
            hide-progress-circle
            class="col-span-4"
        />
        <lazy-routine-tasks
            carousel-orientation="vertical"
            hide-progress-circle
            class="col-span-4"
        />
        <lazy-upcoming-deliveries
            carousel-orientation="vertical"
            class="col-span-4"
        />
        <lazy-table-bookings v-show="hasTableBookings" class="col-span-4" />
        <!-- <lazy-advent-calendar v-if="isDecember" class="col-span-full" /> -->
        <lazy-staff-leaderboard
            class="col-span-full"
            item-classes="md:basis-1/2"
        />
        <lazy-upcoming-holidays class="col-span-full" />
        <lazy-notice-board class="col-span-full" />
        <lazy-reviews-listings class="col-span-full" />
        <div class="p-default col-span-full flex justify-around gap-4">
            <lazy-single-day-dot :days-plus="2" title="+ 3 Days" />
            <lazy-single-day-dot :days-plus="4" title="+ 5 Days" />
            <lazy-single-day-dot :days-plus="6" title="+ 7 Days" />
            <lazy-single-day-dot :days-plus="13" title="+ 14 Days" />
        </div>
        <lazy-standing-orders class="col-span-full" />
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
// const date = new Date()
// const isDecember: ComputedRef<boolean> = computed(() => {
//     return date.getMonth() === 11
// })
</script>
