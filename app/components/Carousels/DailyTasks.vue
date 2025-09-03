<template>
    <div class="p-c-default">
        <h2 class="uc-text uc-text--carousel-title">Daily tasks</h2>
        <div class="relative">
            <transition name="fade">
                <div v-if="dataFetched" class="flex gap-4">
                    <div class="relative flex w-16 flex-col">
                        <progress-bar-circular
                            v-if="totalDailyTaskInstances"
                            class="my-auto"
                            :total-items="totalDailyTaskInstances"
                            :completed-items="taskCountCompletedToday"
                        />
                    </div>
                    <div v-if="hasSortedDailyTasks" class="min-w-0 flex-1">
                        <u-carousel
                            v-if="sortedDailyTasks"
                            v-slot="{ item }"
                            drag-free
                            :items="sortedDailyTasks"
                            auto-height
                            :ui="{ item: 'basis-48' }"
                        >
                            <card-daily-task :item="item" />
                        </u-carousel>
                    </div>
                </div>
            </transition>
            <transition name="fade-absolute">
                <div
                    v-if="!dataFetched"
                    class="flex w-full gap-4 overflow-hidden"
                >
                    <u-skeleton class="h-17 w-17 shrink-0 rounded-full" />
                    <u-skeleton
                        v-for="i in 6"
                        :key="i"
                        class="h-17 shrink-0 basis-48"
                    />
                </div>
            </transition>
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

const allDailyTaskInstances: ComputedRef<TypeDailyTask[] | null> = computed(
    () => {
        return tasksStore.allDailyTaskInstances
    }
)

const sortedDailyTasks: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    if (!allDailyTaskInstances.value) return null
    const incompleteToday = allDailyTaskInstances.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() !==
            today.toDateString()
    )
    incompleteToday.sort((a, b) => {
        return a.fields.task.fields.dueByHour - b.fields.task.fields.dueByHour
    })
    const completeToday = allDailyTaskInstances.value.filter(
        (task) =>
            new Date(task.fields.lastCompleted).toDateString() ===
            today.toDateString()
    )
    return [...incompleteToday, ...completeToday]
})

const hasSortedDailyTasks: ComputedRef<boolean> = computed(() => {
    return !!sortedDailyTasks.value && sortedDailyTasks.value.length > 0
})

const totalDailyTaskInstances: ComputedRef<number | null> = computed(() => {
    return tasksStore.totalDailyTaskInstances
})

const taskCountCompletedToday: ComputedRef<number> = computed(() => {
    return (
        allDailyTaskInstances.value?.filter((task) => {
            const lastCompleted = task.fields.lastCompleted
            if (!lastCompleted) return false
            const lastCompletedDate = new Date(lastCompleted)
            return lastCompletedDate.toDateString() === today.toDateString()
        }).length || 0
    )
})

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    key: 'dailyTasks',
    lazy: true,
    server: false,
    params: computed(() => ({
        content_type: 'taskInstance',
        'fields.location.sys.id': activeLocationId.value,
        'fields.task.sys.contentType.sys.id': 'dailyTask'
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
        tasksStore.allDailyTaskInstances = newData.items
        tasksStore.totalDailyTaskInstances = newData.total
    }
})
</script>
