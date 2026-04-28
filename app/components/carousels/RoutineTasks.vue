<template>
    <div class="p-c-default relative">
        <u-slideover
            title="All Routine Tasks"
            class="relative"
            aria-label="All Routine Tasks"
        >
            <carousel-title-and-action title="Routine tasks">
                <u-button
                    size="2xs"
                    icon="i-bxs-show"
                    variant="soft"
                    class="mr-2"
                    label="See all"
                />
            </carousel-title-and-action>
            <template #body>
                <div class="relative">
                    <transition name="fade">
                        <loading-overlay
                            v-if="loading"
                            class="fixed backdrop-blur-xs"
                        />
                    </transition>

                    <u-accordion
                        type="multiple"
                        :items="allRoutineTasksForAccordions"
                    >
                        <template #body="{ item }">
                            <div
                                class="mb-4 ml-4 border-l border-zinc-200 pl-4"
                            >
                                <rich-text :content="item.description" />
                            </div>
                            <div class="flex gap-1">
                                <u-badge
                                    size="sm"
                                    color="neutral"
                                    variant="outline"
                                    icon="i-bx-hourglass"
                                >
                                    <span
                                        >{{
                                            item.fullTask.fields.task.fields
                                                .minutesToComplete
                                        }}
                                        mins
                                    </span>
                                </u-badge>
                                <u-badge
                                    size="sm"
                                    color="neutral"
                                    variant="outline"
                                    icon="i-akar-icons-arrow-cycle"
                                >
                                    <span>
                                        Every
                                        {{
                                            item.fullTask.fields.task.fields
                                                .frequencyInDays
                                        }}
                                        days
                                    </span>
                                </u-badge>
                                <u-badge
                                    size="sm"
                                    color="neutral"
                                    variant="outline"
                                    icon="i-prime-history"
                                    :label="`${shortDateConverter(item.lastCompleted)} at ${getTime(item.lastCompleted)} ${item.completedBy ? `by ${item.completedBy}` : ''}`"
                                />
                            </div>
                            <div
                                v-if="
                                    item.fullTask.fields.task.fields.article &&
                                    item.fullTask.fields.task.fields.article
                                "
                                class="mt-8"
                            >
                                <p class="uc-text mb-1 font-semibold">
                                    Related Articles:
                                </p>

                                <u-button
                                    v-for="article in item.fullTask.fields.task
                                        .fields.article"
                                    :key="article.sys.id"
                                    :href="`/article/${article.fields.slug}`"
                                    trailing-icon="i-material-symbols-arrow-right-alt"
                                    variant="outline"
                                    color="neutral"
                                >
                                    {{ article.fields.title }}
                                </u-button>
                            </div>
                            <div class="mt-8 flex flex-col items-start gap-2">
                                <u-button
                                    color="tertiary"
                                    :icon="
                                        loading
                                            ? 'i-svg-spinners-blocks-shuffle-3'
                                            : 'i-bx-check'
                                    "
                                    label="Complete now"
                                    @click="handleCompleteTask(item.fullTask)"
                                />
                            </div>
                        </template>
                    </u-accordion>
                </div>
            </template>
        </u-slideover>
        <div class="relative">
            <transition name="fade">
                <div v-if="hasRoutineTaskInstances" class="flex gap-4">
                    <div
                        v-if="!hideProgressCircle"
                        class="relative flex w-16 flex-col text-center"
                    >
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
                            :orientation="carouselOrientation"
                            :ui="carouselUi"
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
interface Props {
    hideProgressCircle?: boolean
    carouselOrientation?: 'horizontal' | 'vertical'
}

const props = defineProps<Props>()

import type { AccordionItem } from '@nuxt/ui'

const tasksStore = useTasksStore()
const locationsStore = useLocationsStore()

const { shortDateConverter, getTime } = useDateUtils()

/* Computed */

const carouselUi = computed(() => {
    return props.carouselOrientation === 'vertical'
        ? {
              item: 'w-full basis-20',
              container: 'h-100'
          }
        : {
              item: 'basis-48'
          }
})

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
)

const allRoutineTasksForAccordions: ComputedRef<AccordionItem[]> = computed(
    () => {
        return (
            allRoutineTaskInstances.value
                ?.map((task) => ({
                    id: task.sys.id,
                    label: task.fields.task.fields.title,
                    description: task.fields.task.fields.description,
                    lastCompleted:
                        task.fields.lastCompleted &&
                        new Date(task.fields.lastCompleted),
                    completedBy: task.fields.completedBy,
                    fullTask: task
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) || []
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
    immediate: shouldFetch.value,
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

const loading: Ref<boolean> = ref(false)

const { completeTask } = useContentfulUtils()

const handleCompleteTask = async (task: TypeDailyTask) => {
    loading.value = true
    await completeTask(task, 'routineTasks')
    loading.value = false
}
</script>
