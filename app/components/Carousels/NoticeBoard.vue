<template>
    <div class="p-default">
        <h2 class="uc-text uc-text--xs">Notice Board</h2>
        <u-carousel
            v-if="dataFetched"
            dots
            :items="orders"
            :autoplay="{
                delay: 10000
            }"
        >
            <template #default="{ item }">
                <u-card variant="solid">
                    <h3 class="h4 mb-2">{{ item.fields.title }}</h3>
                    <rich-text :content="item.fields.content" />
                </u-card>
            </template>
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
        order: 'sys.createdAt'
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
