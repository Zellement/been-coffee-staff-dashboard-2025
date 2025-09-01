<template>
    <div class="p-c-default">
        <u-slideover title="All Routine Tasks" aria-label="All Routine Tasks">
            <h2 class="uc-text uc-text--carousel-title flex items-center gap-2">
                <span>Routine tasks</span>
                <u-icon name="i-bxs-show" size="20" />
            </h2>
            <template #body>
                <u-accordion :items="allRoutineTasksForAccordions">
                    <template #body="{ item }">
                        <div class="ml-4 border-l border-zinc-200 pl-4">
                            <rich-text :content="item.description" />
                        </div>
                    </template>
                </u-accordion>
            </template>
        </u-slideover>
        <div v-if="dataFetched" class="flex gap-4">
            <div class="relative flex w-16 flex-col text-center">
                <progress-bar-circular-countdown
                    v-if="hasSortedRoutineTasks"
                    class="my-auto"
                    :left-number="newTasks.length"
                    :right-number="overdueTasks.length"
                />
            </div>
            <div v-if="hasSortedRoutineTasks" class="min-w-0 flex-1">
                <u-carousel
                    v-if="sortedRoutineTaskInstances"
                    v-slot="{ item }"
                    drag-free
                    :items="sortedRoutineTaskInstances"
                    auto-height
                    :ui="{ item: 'basis-48' }"
                >
                    <card-routine-task :key="item.sys.id" :item="item" />
                </u-carousel>
            </div>
        </div>
        <div v-else class="flex w-full gap-4 overflow-hidden">
            <u-skeleton class="h-17 w-17 shrink-0 rounded-full" />
            <u-skeleton
                v-for="i in 6"
                :key="i"
                class="h-16 shrink-0 basis-48"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const tasksStore = useTasksStore()
const locationsStore = useLocationsStore()

const today = new Date()
const futureDate = new Date(today)
futureDate.setDate(futureDate.getDate() + 7)

const dataFetched: Ref<boolean> = ref(false)

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => !!activeLocationId.value
)

const allRoutineTasksForAccordions: ComputedRef<AccordionItem[]> = computed(
    () => {
        return (
            allRoutineTaskInstances.value?.map((task) => ({
                id: task.sys.id,
                label: task.fields.task.fields.title,
                description: task.fields.task.fields.description
            })) || []
        )
    }
)

const allRoutineTaskInstances: ComputedRef<TypeDailyTask[] | null> = computed(
    () => {
        return tasksStore.allRoutineTaskInstances
    }
)

const sortedRoutineTaskInstances: ComputedRef<TypeDailyTask[] | null> =
    computed(() => {
        return [
            ...newTasks.value,
            ...overdueTasks.value,
            ...upcomingTasks.value
        ]
    })

const newTasks: ComputedRef<(TypeTaskInstance & { type: 'new' })[]> = computed(
    () => {
        if (!allRoutineTaskInstances.value) return []
        return allRoutineTaskInstances.value
            .filter((task: TypeTaskInstance) => {
                return task.nextDueDate === null
            })
            .map((task: TypeTaskInstance) => ({
                ...task,
                type: 'new' as const
            }))
    }
)

const overdueTasks: ComputedRef<(TypeTaskInstance & { type: 'overdue' })[]> =
    computed(() => {
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

const upcomingTasks: ComputedRef<(TypeTaskInstance & { type: 'upcoming' })[]> =
    computed(() => {
        if (!allRoutineTaskInstances.value) return []
        return allRoutineTaskInstances.value
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
    })

const hasSortedRoutineTasks: ComputedRef<boolean> = computed(() => {
    return (
        !!sortedRoutineTaskInstances.value &&
        sortedRoutineTaskInstances.value.length > 0
    )
})

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    key: 'routineTasks',
    lazy: true,
    server: false,
    params: computed(() => ({
        content_type: 'taskInstance',
        'fields.location.sys.id': activeLocationId.value,
        'fields.task.sys.contentType.sys.id': 'routineTask',
        order: 'fields.title',
        include: 3
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
        let finalData: (TypeTaskInstance & {
            nextDueDate: Date | null
            lastCompletedDate: Date | null
        })[] = []
        newData.items.map((taskInstance: TypeTaskInstance) => {
            let lastCompletedDate = null
            if (taskInstance.fields.lastCompleted) {
                lastCompletedDate = new Date(taskInstance.fields.lastCompleted)
            }
            let nextDueDate = null
            if (lastCompletedDate) {
                nextDueDate = new Date(lastCompletedDate)
                nextDueDate.setDate(
                    nextDueDate.getDate() +
                        taskInstance.fields.task.fields.frequencyInDays
                )
            }

            const data = {
                ...taskInstance,
                nextDueDate: nextDueDate,
                lastCompletedDate: lastCompletedDate
            }

            finalData.push(data)
        })
        tasksStore.allRoutineTaskInstances = finalData
    }
})
</script>
