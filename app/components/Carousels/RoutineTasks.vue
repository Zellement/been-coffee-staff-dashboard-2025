<template>
    <div class="">
        <h2 class="uppercase">Routine tasks</h2>
        <div class="flex gap-4">
            <div class="relative flex w-16 flex-col text-center">
                <progress-bar-circular
                    v-if="totalRoutineTaskInstances"
                    class="my-auto"
                    :total-items="totalRoutineTaskInstances"
                    :completed-items="taskCountCompletedToday"
                />
            </div>
            <div v-if="hasSortedRoutineTasks" class="min-w-0 flex-1">
                <u-carousel
                    v-if="sortedRoutineTasks"
                    v-slot="{ item }"
                    :items="sortedRoutineTasks"
                    auto-height
                    :ui="{ item: 'basis-48' }"
                >
                    <single-routine-task-card :item="item" />
                </u-carousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const tasksStore = useTasksStore()

// const { fetchDailyTaskInstances } = useTasksUtils()

const today = new Date()

/* Computed */

const allRoutineTaskInstances: ComputedRef<TypeDailyTask[] | null> = computed(
    () => {
        return tasksStore.allRoutineTaskInstances
    }
)

const sortedRoutineTasks: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    if (!allRoutineTaskInstances.value) return null
    const incompleteToday = allRoutineTaskInstances.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() !==
            today.toDateString()
    )
    incompleteToday.sort((a, b) => {
        return a.fields.task.fields.dueByHour - b.fields.task.fields.dueByHour
    })
    const completeToday = allRoutineTaskInstances.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() ===
            today.toDateString()
    )
    return [...incompleteToday, ...completeToday]
})

const hasSortedRoutineTasks: ComputedRef<boolean> = computed(() => {
    return !!sortedRoutineTasks.value && sortedRoutineTasks.value.length > 0
})

const totalRoutineTaskInstances: ComputedRef<number | null> = computed(() => {
    return tasksStore.totalRoutineTaskInstances
})

const taskCountCompletedToday: ComputedRef<number> = computed(() => {
    return (
        allRoutineTaskInstances.value?.filter((task) => {
            const lastCompleted = task.fields.lastCompleted
            if (!lastCompleted) return false
            const lastCompletedDate = new Date(lastCompleted)
            return lastCompletedDate.toDateString() === today.toDateString()
        }).length || 0
    )
})

const locationsStore = useLocationsStore()

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const { data } = useFetch('/api/contentful/fetch-entries', {
    params: computed(() => ({
        content_type: 'taskInstance',
        'fields.location.sys.id': activeLocationId.value,
        'fields.task.sys.contentType.sys.id': 'routineTask',
        include: 2
    }))
})

watch(
    data,
    (newData) => {
        if (newData) {
            // console.log('location active:', activeLocationId)
            // console.log('Daily tasks data updated:', newData)
            // @ts-expect-error Always items
            tasksStore.allRoutineTaskInstances = newData.items
            // @ts-expect-error Always total
            tasksStore.totalRoutineTaskInstances = newData.total
        }
    },
    { immediate: true }
)
</script>
