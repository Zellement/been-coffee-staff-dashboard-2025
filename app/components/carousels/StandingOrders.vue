<template>
    <div v-if="hasOrders" class="p-default mb-8">
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
                @click="fetchData"
            />
        </carousel-title-and-action>
        <div class="relative">
            <transition name="fade">
                <u-carousel
                    v-if="hasOrders && orders"
                    v-slot="{ item }"
                    dots
                    :items="orders"
                    :ui="{
                        root: 'flex',
                        container: 'items-stretch h-full',
                        item: 'h-full flex md:basis-96'
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
                    skeleton-class="h-96 shrink-0 basis-4/5 sm:basis-1/2 lg:basis-1/3 2xl:basis-96"
                />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()
const standingOrdersStore = useStandingOrdersStore()

const orders: ComputedRef<TypeStandingOrder[] | null> = computed(() => {
    return standingOrdersStore.cachedStandingOrders || null
})

const { shortDateConverter } = useDateUtils()

const hasOrders: ComputedRef<boolean> = computed(() => {
    return !!orders.value && orders.value?.length > 0
})

/* Computed */

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

/* Functions & lifecycle */

const fetchData = async () => {
    standingOrdersStore.clearCache()
    const data = await $fetch('/api/contentful/fetch-entries', {
        method: 'GET',
        params: {
            content_type: 'standingOrder',
            'fields.location.sys.id': activeLocationId.value
        }
    })
    standingOrdersStore.cachedStandingOrders = data?.items
    standingOrdersStore.lastFetched = new Date()
}

onMounted(async () => {
    if (activeLocationId.value && !hasOrders.value) {
        await fetchData()
    }
})

watch(
    () => activeLocationId.value,
    async (newLocationId, oldLocationId) => {
        if (newLocationId && newLocationId !== oldLocationId) {
            await fetchData()
        }
    }
)
</script>
