<template>
    <div class="p-default mb-8">
        <h2 class="uc-text uc-text--carousel-title">Notice Board</h2>
        <u-carousel
            v-if="dataFetched"
            v-slot="{ item }"
            dots
            :items="orders"
            :autoplay="{
                delay: 10000
            }"
            :ui="{
                root: 'flex',
                container: 'items-stretch  h-full',
                item: 'h-full flex md:basis-1/2 2xl:basis-sm'
            }"
        >
            <u-card
                :ui="{
                    root: 'h-full flex w-full'
                }"
                variant="subtle"
            >
                <div class="mb-4 flex items-start justify-between">
                    <h3 class="h5">{{ item.fields.title }}</h3>
                    <u-badge
                        v-if="item.fields.sticky"
                        variant="outline"
                        color="neutral"
                        label="This notice is pinned"
                    />
                </div>
                <rich-text :content="item.fields.content" />
            </u-card>
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
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
    key: 'noticeBoard',
    lazy: true,
    server: false,
    params: computed(() => ({
        content_type: 'noticeBoard',
        limit: 20,
        order: 'sys.createdAt',
        'fields.locations.sys.id[in]': activeLocationId.value
    })),
    immediate: false
})

watch(
    shouldFetch,
    (ready) => {
        if (ready) {
            execute().then(() => {
                dataFetched.value = true
                orders.value = data.value?.items || []
            })
        }
    },
    { immediate: true }
)

watch(data, (newData) => {
    if (newData) {
        orders.value = newData.items || []
    }
})
</script>
