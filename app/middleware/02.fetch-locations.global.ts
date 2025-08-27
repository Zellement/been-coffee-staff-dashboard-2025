export default defineNuxtRouteMiddleware(async () => {
    const locationsStore = useLocationsStore()

    if (locationsStore.allLocations && locationsStore.allLocations.length)
        return

    const data = await $fetch('/api/contentful/fetch-entries', {
        params: { content_type: 'location', include: 1 }
    })

    locationsStore.allLocations = data.items
    locationsStore.totalLocations = data.total
})
