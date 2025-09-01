<template>
    <div class="p-default mb-8">
        <div class="flex items-center justify-between">
            <h2 class="uc-text uc-text--carousel-title">Standing Orders</h2>
            <u-button
                size="xs"
                icon="i-bx-refresh"
                variant="outline"
                @click="cachedDataStore.clearAllCachedData"
            />
        </div>
        <u-carousel
            v-slot="{ item }"
            dots
            drag-free
            :items="orders"
            :ui="{
                root: 'flex',
                container: 'items-stretch h-full',
                item: 'h-full flex '
            }"
        >
            <u-card
                :ui="{
                    root: 'h-full flex w-full'
                }"
                variant="subtle"
            >
                <div class="flex flex-col items-start gap-4">
                    <nuxt-img
                        v-if="
                            item.fields.supplier.fields.logo?.fields?.file?.url
                        "
                        class="mt-2 h-10 w-auto max-w-full rounded bg-white p-0.5"
                        :src="`${item.fields.supplier.fields.logo?.fields?.file?.url}?h=40&fm=webp`"
                        :alt="item.fields.supplier.fields.title"
                    />
                    <h3 class="uc-text">{{ item.fields.frequency }}</h3>
                    <rich-text :content="item.fields.details" />
                </div>
            </u-card>
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()
const cachedDataStore = useCachedDataStore()

const dataFetched: Ref<boolean> = ref(false)
const orders: ComputedRef<TypeStandingOrder[]> = computed(() => {
    return cachedDataStore.cachedStandingOrders || []
})

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () =>
        !!activeLocationId.value &&
        cachedDataStore.cachedStandingOrders === null
)

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/contentful/fetch-entries', {
    key: 'standingOrder',
    lazy: true,
    server: false,
    params: computed(() => ({
        content_type: 'standingOrder',
        'fields.location.sys.id': activeLocationId.value
    })),
    immediate: false
})

watch(
    shouldFetch,
    (ready) => {
        if (ready) {
            execute().then(() => {
                console.log('Fetched standing orders:', data.value?.items)
                dataFetched.value = true
                cachedDataStore.cachedStandingOrders = orders.value
            })
        }
    },
    { immediate: true }
)

watch(data, (newData) => {
    if (newData) {
        cachedDataStore.cachedStandingOrders = newData.items || []
    }
})
</script>
