export const useTasksUtils = () => {
    const { fetchEntries } = useContentfulUtils()

    const tasksStore = useTasksStore()
    const locationsStore = useLocationsStore()

    const fetchDailyTaskInstances = async () => {
        const dailyTasksFetch = await fetchEntries({
            content_type: 'taskInstance',
            // order: getOrderField.value,
            // Fetch tasks for specific locations, matching against locationsStore.activeLocation
            'fields.location.sys.id': locationsStore.activeLocation?.sys.id,
            include: 2
        })
        tasksStore.allDailyTaskInstances = dailyTasksFetch?.items
        tasksStore.totalDailyTaskInstances = dailyTasksFetch?.total
    }

    return { fetchDailyTaskInstances }
}
