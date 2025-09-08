<template>
    <div class="p-default sticky top-0 z-10 flex w-full justify-end">
        <u-button
            label="Refresh"
            variant="outline"
            size="sm"
            @click="refreshData"
        />
    </div>
    <div class="page grid grid-cols-12 gap-4">
        <daily-tasks class="col-span-full" />
        <routine-tasks class="col-span-full" />
        <upcoming-deliveries class="col-span-full" />
        <reviews-listings class="col-span-full" />
        <standing-orders class="col-span-full" />
        <location-team class="col-span-full" />
    </div>
</template>

<script setup lang="ts">
const uiStore = useUiStore()
const refreshData = async () => {
    uiStore.refreshing = true
    await refreshNuxtData()
    uiStore.refreshing = false
}

definePageMeta({
    layout: 'dash'
})

useHead({
    title: 'Been Coffee Staff Dashboard'
})
</script>
