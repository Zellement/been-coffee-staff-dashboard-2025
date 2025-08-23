<template>
    <div class="p-default">
        <h2 class="uc-text uc-text--xs">Routine tasks</h2>
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
const locationsStore = useLocationsStore()

const today = new Date()

const dataFetched: Ref<boolean> = ref(false)

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => !!activeLocationId.value
)

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

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    params: computed(() => ({
        content_type: 'taskInstance',
        'fields.location.sys.id': activeLocationId.value,
        'fields.task.sys.contentType.sys.id': 'routineTask'
    })),
    immediate: false
})

watch(
    shouldFetch,
    (ready) => {
        if (ready) {
            execute().then(() => {
                dataFetched.value = true
            })
        }
    },
    { immediate: true }
)

watch(data, (newData) => {
    if (newData) {
        tasksStore.allRoutineTaskInstances = newData.items
        tasksStore.totalRoutineTaskInstances = newData.total
    }
})
</script>
