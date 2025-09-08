import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', () => {
    /**
     * State
     **/

    const allDailyTaskInstances: Ref<TypeTaskInstance[] | null> = ref(null)
    const totalDailyTaskInstances: Ref<number | null> = ref(null)

    const allRoutineTaskInstances: Ref<TypeTaskInstance[] | null> = ref(null)

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
        taskCountCompletedToday
    }
})
