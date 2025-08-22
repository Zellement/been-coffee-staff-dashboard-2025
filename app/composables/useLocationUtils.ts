// export const useLocationUtils = () => {
//     const { fetchEntries } = useContentfulUtils()

//     const locationsStore = useLocationsStore()

//     const fetchLocations = async () => {
//         const locationsFetch = await fetchEntries({
//             content_type: 'location'
//         })

//         // @ts-expect-error Always items
//         locationsStore.allLocations = locationsFetch?.items
//         // @ts-expect-error Always total
//         locationsStore.totalLocations = locationsFetch?.total
//         // @ts-expect-error Always items
//         locationsStore.activeLocation = locationsFetch?.items?.[0] || null
//     }

//     return { fetchLocations }
// }
