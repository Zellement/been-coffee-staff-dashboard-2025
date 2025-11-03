<template>
    <transition name="fade">
        <div v-if="hasSingleTasks" class="p-c-default">
            <carousel-title-and-action title="Single tasks" />
            <div class="relative">
                <u-carousel
                    v-slot="{ item }"
                    drag-free
                    :items="allSingleTasks"
                    :ui="{ item: 'basis-80' }"
                >
                    <card-single-task :item="item" />
                </u-carousel>
            </div>
        </div>
    </transition>
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

watch(data, (newData) => {
    if (newData) {
        tasksStore.allSingleTasks = newData.items
        tasksStore.totalSingleTasks = newData.total
    }
})
</script>
