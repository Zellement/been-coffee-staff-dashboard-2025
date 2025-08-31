export default defineNuxtRouteMiddleware(async () => {
    // Get all locations
    const locationsStore = useLocationsStore()

    if (locationsStore.allLocations && locationsStore.allLocations.length)
        return

    const locationData = await $fetch('/api/contentful/fetch-entries', {
        params: { content_type: 'location', include: 2 }
    })

    locationsStore.allLocations = locationData.items
    locationsStore.totalLocations = locationData.total
})
