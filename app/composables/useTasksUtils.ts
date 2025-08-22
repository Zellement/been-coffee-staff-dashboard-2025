// export const useTasksUtils = () => {
//     const { fetchEntries } = useContentfulUtils()

//     const tasksStore = useTasksStore()
//     const locationsStore = useLocationsStore()

//     const fetchDailyTaskInstances = async () => {
//         try {
//             const dailyTasksFetch = await fetchEntries({
//                 content_type: 'taskInstance',
//                 // order: getOrderField.value,
//                 // Fetch tasks for specific locations, matching against locationsStore.activeLocation
//                 'fields.location.sys.id': locationsStore.activeLocation?.sys.id,
//                 include: 2
//             })
//             // @ts-expect-error Always items
//             tasksStore.allDailyTaskInstances = dailyTasksFetch?.items
//             // @ts-expect-error Always total
//             tasksStore.totalDailyTaskInstances = dailyTasksFetch?.total
//         } catch (error) {
//             console.error('Error fetching daily task instances:', error)
//         }
//     }

//     return { fetchDailyTaskInstances }
// }
