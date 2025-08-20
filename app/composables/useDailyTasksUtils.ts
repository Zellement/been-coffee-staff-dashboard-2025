export const useDailyTasksUtils = () => {
    const { fetchEntries } = useContentfulUtils()

    const dailyTasksStore = useDailyTasksStore()

    const fetchDailyTasks = async () => {
        const dailyTasksFetch = await fetchEntries({
            content_type: 'dailyTask',
            order: '-fields.lastCompleted'
        })
        dailyTasksStore.allDailyTasks = dailyTasksFetch?.items
        dailyTasksStore.totalDailyTasks = dailyTasksFetch?.total
    }

    return { fetchDailyTasks }
}
