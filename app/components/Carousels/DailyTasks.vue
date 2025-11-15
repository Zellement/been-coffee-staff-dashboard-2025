<template>
    <div class="p-c-default">
        <!-- <pre>{{ allTodaysTasks }}</pre> -->
        <!-- {{ todaysDayAsString }} -->
        <!-- <pre> {{ setDayTasks }}</pre> -->
        <carousel-title-and-action title="Daily tasks" />
        <div class="relative">
            <transition name="fade">
                <div v-if="hasTodayTasks" class="flex gap-4">
                    <div
                        v-if="!hideProgressCircle"
                        class="relative flex w-16 flex-col"
                    >
                        <progress-bar-circular
                            v-if="totalDailyTaskInstances"
                            class="my-auto"
                            :total-items="totalTasks"
                            :completed-items="
                                tasksStore.taskCountCompletedToday
                            "
                        />
                    </div>
                    <div v-if="hasSortedDailyTasks" class="min-w-0 flex-1">
                        <u-carousel
                            v-if="sortedDailyTasks"
                            v-slot="{ item }"
                            drag-free
                            :items="sortedDailyTasks"
                            :ui="{ item: 'basis-48' }"
                        >
                            <card-daily-task
                                v-if="
                                    item.sys.contentType.sys.id ===
                                    'taskInstance'
                                "
                                :item="item"
                            />
                            <card-set-day-task
                                v-if="
                                    item.sys.contentType.sys.id === 'setDayTask'
                                "
                                :item="item"
                            />
                        </u-carousel>
                    </div>
                </div>
            </transition>
            <transition name="fade-absolute">
                <div
                    v-if="!hasTodayTasks"
                    class="flex w-full gap-4 overflow-hidden"
                >
                    <u-skeleton class="h-17 w-17 shrink-0 rounded-full" />
                    <u-skeleton
                        v-for="i in 6"
                        :key="i"
                        class="h-20 shrink-0 basis-48"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    hideProgressCircle?: boolean
}

defineProps<Props>()

const tasksStore = useTasksStore()
const locationsStore = useLocationsStore()

const today = new Date()

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
)

const allTodaysTasks: ComputedRef<(TypeDailyTask | TypeSetDayTask)[] | null> =
    computed(() => {
        return [
            ...(tasksStore.allDailyTaskInstances || []),
            ...(tasksStore.allTodaySetDayTasks || [])
        ]
    })

const hasTodayTasks: ComputedRef<boolean> = computed(() => {
    return !!allTodaysTasks.value && allTodaysTasks.value.length > 0
})

const incompleteSetDayTasks = computed(() => {
    return allTodaysTasks.value
        ?.filter(
            (task) =>
                task.sys.contentType.sys.id === 'setDayTask' &&
                (!task.fields.lastCompleted ||
                    new Date(task.fields.lastCompleted).toDateString() !==
                        today.toDateString())
        )
        .sort((a, b) => {
            return a.fields.time - b.fields.time
        })
})

const incompleteToday = computed(() => {
    return allTodaysTasks.value
        ?.filter(
            (task) =>
                task.sys.contentType.sys.id === 'taskInstance' &&
                new Date(task.fields.lastCompleted).toDateString() !==
                    today.toDateString()
        )
        .sort((a, b) => {
            return (
                a.fields.task.fields.dueByHour - b.fields.task.fields.dueByHour
            )
        })
})

const allIncomplete = computed(() => {
    return [
        ...(incompleteToday.value ?? []),
        ...(incompleteSetDayTasks.value ?? [])
    ].sort((a, b) => {
        const timeA =
            a.sys.contentType.sys.id === 'taskInstance'
                ? a.fields.task.fields.dueByHour
                : a.fields.time
        const timeB =
            b.sys.contentType.sys.id === 'taskInstance'
                ? b.fields.task.fields.dueByHour
                : b.fields.time
        return timeA - timeB
    })
})

const completeToday = computed(() => {
    return allTodaysTasks.value?.filter(
        (task) =>
            task.sys.contentType.sys.id === 'taskInstance' &&
            new Date(task.fields.lastCompleted).toDateString() ===
                today.toDateString()
    )
})

const completeSetDayTasks = computed(() => {
    return allTodaysTasks.value?.filter(
        (task) =>
            task.sys.contentType.sys.id === 'setDayTask' &&
            task.fields.lastCompleted &&
            new Date(task.fields.lastCompleted).toDateString() ===
                today.toDateString()
    )
})

const allCompleteToday = computed(() => {
    return [
        ...(completeToday.value ?? []),
        ...(completeSetDayTasks.value ?? [])
    ].sort((a, b) => {
        const timeA =
            a.sys.contentType.sys.id === 'taskInstance'
                ? a.fields.task.fields.dueByHour
                : a.fields.time
        const timeB =
            b.sys.contentType.sys.id === 'taskInstance'
                ? b.fields.task.fields.dueByHour
                : b.fields.time
        return timeA - timeB
    })
})

const sortedDailyTasks: ComputedRef<TypeDailyTask[] | null> = computed(() => {
    return [...allIncomplete.value, ...allCompleteToday.value]
})

const hasSortedDailyTasks: ComputedRef<boolean> = computed(() => {
    return !!sortedDailyTasks.value && sortedDailyTasks.value.length > 0
})

const totalDailyTaskInstances: ComputedRef<number> = computed(() => {
    return tasksStore.totalDailyTaskInstances || 0
})

const totalTodaySetDayTasks: ComputedRef<number> = computed(() => {
    return tasksStore.totalTodaySetDayTasks || 0
})

const totalTasks: ComputedRef<number> = computed(() => {
    return totalDailyTaskInstances.value + totalTodaySetDayTasks.value || 0
})

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'dailyTasks',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'taskInstance',
        'fields.location.sys.id': activeLocationId.value,
        'fields.task.sys.contentType.sys.id': 'dailyTask',
        include: 3
    }))
})

const todaysDay = today.getDay()

const todaysDayAsString = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
][todaysDay]

const { data: setDayTasks } = useFetch('/api/contentful/fetch-entries', {
    key: 'setDayTask',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'setDayTask',
        'fields.location.sys.id': activeLocationId.value,
        'fields.day': todaysDayAsString,
        include: 0
    }))
})

watch(data, (newData) => {
    if (newData) {
        tasksStore.allDailyTaskInstances = newData.items
        tasksStore.totalDailyTaskInstances = newData.total
    }
})

watch(setDayTasks, (newData) => {
    if (newData) {
        tasksStore.allTodaySetDayTasks = newData.items
        tasksStore.totalTodaySetDayTasks = newData.total
    }
})
</script>
