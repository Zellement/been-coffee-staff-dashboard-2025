import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', () => {
    /**
     * State
     **/
    const allDailyTasks: Ref<TypeDailyTask[] | null> = ref(null)
    const totalDailyTasks: Ref<number | null> = ref(null)

    const allDailyTaskInstances: Ref<TypeTaskInstance[] | null> = ref(null)
    const totalDailyTaskInstances: Ref<number | null> = ref(null)

    /**
     * Getters
     **/

    /**
     * Actions
     **/

    /**
     * Return
     **/
    return {
        allDailyTasks,
        totalDailyTasks,
        allDailyTaskInstances,
        totalDailyTaskInstances
    }
})
