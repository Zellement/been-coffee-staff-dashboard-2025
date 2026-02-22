<template>
    <div
        v-if="tasksStore.allSingleTasks === null || hasSingleTasks"
        class="p-c-default"
    >
        <carousel-title-and-action title="Single tasks" />
        <div class="relative">
            <transition name="fade">
                <u-carousel
                    v-if="hasSingleTasks"
                    v-slot="{ item }"
                    drag-free
                    :items="allSingleTasks"
                    :ui="{ item: 'basis-80' }"
                >
                    <card-single-task :item="item" />
                </u-carousel>
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop
                    v-if="tasksStore.allSingleTasks === null"
                    skeleton-class="h-20 shrink-0 basis-80"
                />
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

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
)

const allSingleTasks: ComputedRef<TypeSingleTask[] | undefined> = computed(
    () => {
        return tasksStore.allSingleTasks || undefined
    }
)

const hasSingleTasks: ComputedRef<boolean> = computed(() => {
    return !!allSingleTasks.value && allSingleTasks.value.length > 0
})

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'singleTask',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'singleTask',
        'fields.location.sys.id': activeLocationId.value,
        'fields.lastCompleted[exists]': false,
        include: 1
    }))
})

watch(data, (newData: any) => {
    if (newData) {
        tasksStore.allSingleTasks = newData.items
        tasksStore.totalSingleTasks = newData.total
    }
})
</script>
