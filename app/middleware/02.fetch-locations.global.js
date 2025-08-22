export default defineNuxtRouteMiddleware(async () => {
    const locationsStore = useLocationsStore()

    if (locationsStore.allLocations && locationsStore.allLocations.length)
        return

    const data = await $fetch('/api/contentful/fetch-entries', {
        params: { content_type: 'location', include: 1 }
    })
    // @ts-expect-error Always items
    locationsStore.allLocations = data.items
    // @ts-expect-error Always total
    locationsStore.totalLocations = data.total
})
