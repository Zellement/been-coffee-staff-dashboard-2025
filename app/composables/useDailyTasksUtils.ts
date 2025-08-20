export const useDailyTasksUtils = () => {
    const { fetchEntries } = useContentfulUtils()

    const dailyTasksStore = useDailyTasksStore()

    const fetchDailyTasks = async () => {
        const dailyTasksFetch = await fetchEntries({
            content_type: 'dailyTask'
        })
        dailyTasksStore.allDailyTasks = dailyTasksFetch?.items
        dailyTasksStore.totalDailyTasks = dailyTasksFetch?.total
    }

    return { fetchDailyTasks }
}
