<template>
    <div class="p-c-default">
        <u-slideover title="All Routine Tasks" aria-label="All Routine Tasks">
            <carousel-title-and-action title="Routine tasks">
                <u-button size="xs" icon="i-bxs-show" variant="outline" />
            </carousel-title-and-action>
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
        <div class="relative">
            <transition name="fade">
                <div v-if="hasRoutineTaskInstances" class="flex gap-4">
                    <div class="relative flex w-16 flex-col text-center">
                        <progress-bar-circular-countdown
                            v-if="hasSortedRoutineTasks"
                            class="my-auto"
                            :left-number="tasksStore.overdueTasks.length"
                            :right-number="tasksStore.newTasks.length"
                        />
                    </div>
                    <div v-if="hasSortedRoutineTasks" class="min-w-0 flex-1">
                        <u-carousel
                            v-if="sortedRoutineTaskInstances"
                            v-slot="{ item }"
                            drag-free
                            :items="sortedRoutineTaskInstances"
                            auto-height
                            :ui="{
                                root: 'flex',
                                container: 'items-stretch h-full',
                                item: 'basis-48'
                            }"
                        >
                            <card-routine-task
                                :key="item.sys.id"
                                :item="item"
                            />
                        </u-carousel>
                    </div>
                </div>
            </transition>
            <transition name="fade-absolute">
                <div
                    v-if="!hasRoutineTaskInstances"
                    class="flex w-full gap-4 overflow-hidden"
                >
                    <u-skeleton class="h-17 w-17 shrink-0 rounded-full" />
                    <u-skeleton
                        v-for="i in 6"
                        :key="i"
                        class="h-16 shrink-0 basis-48"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const tasksStore = useTasksStore()
const locationsStore = useLocationsStore()

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
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

const hasRoutineTaskInstances: ComputedRef<boolean> = computed(() => {
    return (
        !!allRoutineTaskInstances.value &&
        allRoutineTaskInstances.value.length > 0
    )
})

const sortedRoutineTaskInstances: ComputedRef<TypeDailyTask[] | null> =
    computed(() => {
        return [
            ...tasksStore.overdueTasks,
            ...tasksStore.newTasks,
            ...tasksStore.upcomingTasks
        ]
    })

const hasSortedRoutineTasks: ComputedRef<boolean> = computed(() => {
    return (
        !!sortedRoutineTaskInstances.value &&
        sortedRoutineTaskInstances.value.length > 0
    )
})

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'routineTasks',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: true,
    params: computed(() => ({
        content_type: 'taskInstance',
        'fields.location.sys.id': activeLocationId.value,
        'fields.task.sys.contentType.sys.id': 'routineTask',
        order: 'fields.title',
        include: 3
    }))
})

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
