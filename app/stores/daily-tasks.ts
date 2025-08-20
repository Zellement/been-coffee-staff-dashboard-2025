import { defineStore } from 'pinia'

export const useDailyTasksStore = defineStore('dailyTasks', () => {
    /**
     * State
     **/
    const allDailyTasks: Ref<TypeDailyTask[] | null> = ref(null)
    const totalDailyTasks: Ref<number | null> = ref(null)

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
        totalDailyTasks
    }
})
