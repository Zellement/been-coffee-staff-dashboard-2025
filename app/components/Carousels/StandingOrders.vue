<template>
    <div class="p-default">
        <carousel-title-and-action title="Standing Orders">
            <u-button
                size="2xs"
                :label="
                    standingOrdersStore.lastFetched
                        ? shortDateConverter(
                              new Date(standingOrdersStore.lastFetched)
                          )
                        : 'Refresh'
                "
                trailing-icon="i-bx-refresh"
                variant="outline"
                @click="standingOrdersStore.clearCache"
            />
        </carousel-title-and-action>
        <div class="relative">
            <transition name="fade">
                <u-carousel
                    v-if="hasOrders"
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
                                    item.fields.supplier.fields.logo?.fields
                                        ?.file?.url
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
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop
                    v-if="!hasOrders"
                    skeleton-class="h-36 shrink-0 basis-4/5 sm:basis-1/2 lg:basis-1/3 2xl:basis-96"
                />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()
const standingOrdersStore = useStandingOrdersStore()

const orders: ComputedRef<TypeStandingOrder[]> = computed(() => {
    return standingOrdersStore.cachedStandingOrders || []
})

const { shortDateConverter } = useDateUtils()

const hasOrders: ComputedRef<boolean> = computed(() => {
    return orders.value.length > 0
})

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () =>
        locationsStore.safeToFetchAllData &&
        standingOrdersStore.cachedStandingOrders === null
)

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'standingOrder',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: true,
    params: computed(() => ({
        content_type: 'standingOrder',
        'fields.location.sys.id': activeLocationId.value
    }))
})

watch(data, (newData) => {
    if (newData) {
        standingOrdersStore.cachedStandingOrders = newData.items || []
        standingOrdersStore.lastFetched = new Date()
    }
})
</script>
