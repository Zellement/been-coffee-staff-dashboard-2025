import { defineStore } from 'pinia'

export const useStaffLeaderboardStore = defineStore(
    'staffLeaderboard',
    () => {
        const cachedEmployees = ref<EmployeeLeaderboardEntry[] | null>(null)
        const lastFetched: Ref<Date | null> = ref(null)

        const clearCache = () => {
            cachedEmployees.value = null
            lastFetched.value = null
            localStorage.removeItem('cachedData')
        }

        type TypeEmployeeWithLoggedMinutes = EmployeeLeaderboardEntry & {
            thisPeriodMinutes: number
        }

        const employeeLeaderboard: ComputedRef<
            TypeEmployeeWithLoggedMinutes[] | null
        > = computed(() => {
            const employees = cachedEmployees.value
            if (!employees) return null

            const { getPayPeriodStartFrom } = useDateUtils()
            const { periodStart } = getPayPeriodStartFrom(new Date())

            // Build list with minutes for the current period
            const employeesWithMinutes = employees.map((employee) => {
                const tasks =
                    employee.fields.taskHistory?.tasksWithMinutes ?? []

                const thisPeriodMinutes = tasks
                    .filter((task) => new Date(task.date) >= periodStart)
                    .reduce((sum, task) => sum + task.timeInMinutes, 0)

                return {
                    ...employee,
                    thisPeriodMinutes
                }
            })

            // Filter out zero-minute employees
            const activeEmployees = employeesWithMinutes.filter(
                (e) => e.thisPeriodMinutes > 0
            )

            // Sort descending
            activeEmployees.sort(
                (a, b) => b.thisPeriodMinutes - a.thisPeriodMinutes
            )

            return activeEmployees
        })

        return {
            cachedEmployees,
            employeeLeaderboard,
            lastFetched,
            clearCache
        }
    }
    // {
    //     persist: {
    //         storage: piniaPluginPersistedstate.localStorage()
    //     }
    // }
)
