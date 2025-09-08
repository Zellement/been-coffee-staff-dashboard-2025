<template>
    <div class="page grid grid-cols-12 gap-4">
        <daily-tasks hide-progress-circle class="col-span-full" />
        <routine-tasks hide-progress-circle class="col-span-full" />
        <table-bookings class="col-span-full" />
        <upcoming-deliveries class="col-span-full" />
        <reviews-listings class="col-span-full" />
        <standing-orders class="col-span-full" />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dash'
})

useHead({
    title: 'Been Coffee Staff Dashboard'
})
</script>
