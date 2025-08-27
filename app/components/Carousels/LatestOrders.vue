<template>
    <div class="p-default">
        <h2 class="uc-text uc-text--xs">Latest orders</h2>
        <div v-if="dataFetched" class="flex gap-4">
            <div v-if="orders" class="min-w-0 flex-1">
                <u-carousel
                    v-if="orders"
                    v-slot="{ item }"
                    :items="orders"
                    auto-height
                    :ui="{ item: 'basis-48' }"
                >
                    <pre>{{ item?.fields }}</pre>
                </u-carousel>
            </div>
        </div>
        <div v-else class="flex w-full gap-4 overflow-hidden">
            <u-skeleton class="h-17 w-17 shrink-0 rounded-full" />
            <u-skeleton
                v-for="i in 6"
                :key="i"
                class="h-17 shrink-0 basis-48"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const locationsStore = useLocationsStore()

const dataFetched: Ref<boolean> = ref(false)
const orders: Ref<TypeOrder[]> = ref([])

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => !!activeLocationId.value
)

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    params: computed(() => ({
        content_type: 'order',
        'fields.location.sys.id': activeLocationId.value
    })),
    immediate: false
})

orders.value = data.value?.items || []

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
</script>
