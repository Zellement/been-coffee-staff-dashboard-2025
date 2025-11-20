<template>
    <div class="page grid grid-cols-12 gap-4">
        <lazy-advent-calendar />
        <keep-alive>
            <lazy-shifts-carousel
                class="col-span-full"
                item-classes="md:basis-1/2"
            />
        </keep-alive>
        <keep-alive><lazy-single-tasks class="col-span-full" /></keep-alive>
        <keep-alive><lazy-daily-tasks class="col-span-full" /></keep-alive>
        <keep-alive><lazy-routine-tasks class="col-span-full" /></keep-alive>
        <keep-alive>
            <lazy-upcoming-deliveries class="col-span-full" />
        </keep-alive>
        <keep-alive>
            <table-bookings v-show="hasTableBookings" class="col-span-full" />
        </keep-alive>
        <keep-alive><lazy-notice-board class="col-span-full" /></keep-alive>
        <keep-alive><lazy-reviews-listings class="col-span-full" /></keep-alive>
        <keep-alive><lazy-standing-orders class="col-span-full" /></keep-alive>
        <keep-alive>
            <lazy-been-awesome-winners class="col-span-full" />
        </keep-alive>
        <keep-alive><lazy-location-team class="col-span-full" /></keep-alive>
        <keep-alive><lazy-leadership-team class="col-span-full" /></keep-alive>
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
