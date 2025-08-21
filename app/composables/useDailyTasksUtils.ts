export const useDailyTasksUtils = () => {
    const { fetchEntries } = useContentfulUtils()

    const dailyTasksStore = useDailyTasksStore()
    const locationsStore = useLocationsStore()

    const getOrderField: ComputedRef<string> = computed(() => {
        switch (locationsStore.activeLocation?.fields?.slug) {
            case 'ng10':
                return '-fields.lastCompletedAt_ng10'
            default:
                return '-fields.lastCompletedAt_de65'
        }
    })

    console.log(locationsStore.activeLocation?.sys.id)

    const fetchDailyTasks = async () => {
        const dailyTasksFetch = await fetchEntries({
            content_type: 'dailyTask',
            order: getOrderField.value,
            // Fetch tasks for specific locations, matching against locationsStore.activeLocation
            'fields.locations.sys.id': locationsStore.activeLocation?.sys.id
        })
        dailyTasksStore.allDailyTasks = dailyTasksFetch?.items
        dailyTasksStore.totalDailyTasks = dailyTasksFetch?.total
    }

    return { fetchDailyTasks }
}
