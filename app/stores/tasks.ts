import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', () => {
    /**
     * State
     **/

    const allDailyTaskInstances: Ref<TypeTaskInstance[] | null> = ref(null)
    const totalDailyTaskInstances: Ref<number | null> = ref(null)

    const allRoutineTaskInstances: Ref<TypeTaskInstance[] | null> = ref(null)
    const totalRoutineTaskInstances: Ref<number | null> = ref(null)

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
        allDailyTaskInstances,
        totalDailyTaskInstances,
        allRoutineTaskInstances,
        totalRoutineTaskInstances
    }
})
