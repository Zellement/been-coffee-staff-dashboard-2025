export const useLocationUtils = () => {
    const { fetchEntries } = useContentfulUtils()

    const locationsStore = useLocationsStore()

    const fetchLocations = async () => {
        const locationsFetch = await fetchEntries({
            content_type: 'location'
        })
        locationsStore.allLocations = locationsFetch?.items
        locationsStore.totalLocations = locationsFetch?.total
        locationsStore.activeLocation = locationsFetch?.items?.[0] || null
    }

    return { fetchLocations }
}
