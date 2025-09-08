<template>
    <div class="p-default mb-8">
        <carousel-title-and-action title="Notice Board" />
        <div class="relative">
            <transition name="fade">
                <u-carousel
                    v-if="hasNotices"
                    v-slot="{ item }"
                    dots
                    :items="notices"
                    :autoplay="{
                        delay: 10000
                    }"
                    :ui="{
                        root: 'flex',
                        container: 'items-stretch h-full',
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
                            <div class="flex flex-col items-start gap-1">
                                <h3 class="h5 uc-text uc-text--sm">
                                    {{ item.fields.title }}
                                </h3>
                                <u-badge
                                    variant="outline"
                                    :label="
                                        fullDateConverter(item.sys.updatedAt)
                                    "
                                />
                            </div>
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
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop
                    v-if="!hasNotices"
                    skeleton-class="h-40 shrink-0 basis-full md:basis-1/2 2xl:basis-sm"
                />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const notices: Ref<TypeNoticeBoard[]> = ref([])

const { fullDateConverter } = useDateUtils()

/* Computed */

const hasNotices: ComputedRef<boolean> = computed(() => {
    return notices.value?.length > 0
})

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
)

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'noticeBoard',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: true,
    params: computed(() => ({
        content_type: 'noticeBoard',
        order: 'sys.createdAt',
        'fields.locations.sys.id[in]': activeLocationId.value
    }))
})

watch(data, (newData) => {
    if (newData) {
        const sevenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        notices.value = (newData.items || []).filter(
            (item: TypeNoticeBoard) =>
                new Date(item.sys.updatedAt) >= sevenDaysAgo
        )
    }
})
</script>
