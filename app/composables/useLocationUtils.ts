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

    const returnLastUpdatedFieldName = (): string => {
        switch (locationsStore.activeLocation?.fields?.slug) {
            case 'ng10':
                return 'lastCompletedAt_ng10'
            default:
                return 'lastCompletedAt_de65'
        }
    }

    return { fetchLocations, returnLastUpdatedFieldName }
}
