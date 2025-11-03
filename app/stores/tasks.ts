import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', () => {
    /**
     * State
     **/

    const allDailyTaskInstances: Ref<TypeTaskInstance[] | null> = ref(null)
    const totalDailyTaskInstances: Ref<number | null> = ref(null)

    const allRoutineTaskInstances: Ref<TypeTaskInstance[] | null> = ref(null)

    const allSingleTasks: Ref<TypeSingleTask[] | null> = ref(null)
    const totalSingleTasks: Ref<number | null> = ref(null)

    const today = new Date()
    const futureDate = new Date(today)
    futureDate.setDate(futureDate.getDate() + 7)

    /**
     * Getters
     **/

    const taskCountCompletedToday: ComputedRef<number> = computed(() => {
        const today = new Date()
        return (
            allDailyTaskInstances.value?.filter((task) => {
                const lastCompleted = task.fields.lastCompleted
                if (!lastCompleted) return false
                const lastCompletedDate = new Date(lastCompleted)
                return lastCompletedDate.toDateString() === today.toDateString()
            }).length || 0
        )
    })

    const tasksOverdueToday: ComputedRef<number> = computed(() => {
        // From all tasks, return IDs of those not done today and past their dueByHour
        const today = new Date()
        const instances = allDailyTaskInstances.value?.filter((task) => {
            const lastCompleted = task.fields.lastCompleted
            if (!lastCompleted) return true // never completed
            const lastCompletedDate = new Date(lastCompleted)
            if (lastCompletedDate.toDateString() === today.toDateString())
                return false // done today
            const dueByHour = task.fields.task.fields.dueByHour
            if (dueByHour == null) return false
            const dueDate = new Date(today)
            dueDate.setHours(dueByHour, 0, 0, 0)
            return today > dueDate
        })
        return instances?.length || 0
    })

    const newTasks: ComputedRef<(TypeTaskInstance & { type: 'new' })[]> =
        computed(() => {
            if (!allRoutineTaskInstances.value) return []
            return allRoutineTaskInstances.value
                .filter((task: TypeTaskInstance) => {
                    return task.nextDueDate === null
                })
                .map((task: TypeTaskInstance) => ({
                    ...task,
                    type: 'new' as const
                }))
        })

    const overdueTasks: ComputedRef<
        (TypeTaskInstance & { type: 'overdue' })[]
    > = computed(() => {
        if (!allRoutineTaskInstances.value) return []
        return allRoutineTaskInstances.value
            .filter((task: TypeTaskInstance) => {
                const dueDate = task.nextDueDate
                    ? new Date(task.nextDueDate)
                    : null
                return dueDate !== null && dueDate < today
            })
            .map((task: TypeTaskInstance) => ({
                ...task,
                type: 'overdue' as const
            }))
    })

    const upcomingTasks: ComputedRef<
        (TypeTaskInstance & { type: 'upcoming' })[]
    > = computed(() => {
        if (!allRoutineTaskInstances.value) return []
        const tasks = allRoutineTaskInstances.value
            .filter((task: TypeTaskInstance) => {
                const dueDate = task.nextDueDate
                    ? new Date(task.nextDueDate)
                    : null
                return (
                    dueDate !== null && dueDate > today && dueDate <= futureDate
                )
            })
            .map((task: TypeTaskInstance) => ({
                ...task,
                type: 'upcoming' as const
            }))

        tasks.sort((a, b) => {
            if (a.nextDueDate && b.nextDueDate) {
                return a.nextDueDate.getTime() - b.nextDueDate.getTime()
            }
            return 0
        })

        return tasks
    })

    /**
     * Actions
     **/

    /**
     * Return
     **/
    return {
        allDailyTaskInstances,
        totalDailyTaskInstances,
        allRoutineTaskInstances,
        allSingleTasks,
        totalSingleTasks,
        newTasks,
        overdueTasks,
        upcomingTasks,
        taskCountCompletedToday,
        tasksOverdueToday
    }
})
