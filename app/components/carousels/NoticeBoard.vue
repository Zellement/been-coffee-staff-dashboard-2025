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
                        <div
                            class="mb-4 flex items-start justify-between gap-8"
                        >
                            <div class="flex w-full justify-between">
                                <div class="flex flex-col items-start gap-1">
                                    <h3 class="h5 uc-text uc-text--sm">
                                        {{ item.fields.title }}
                                    </h3>

                                    <u-badge
                                        variant="outline"
                                        :label="
                                            fullDateConverter(
                                                item.sys.updatedAt
                                            )
                                        "
                                    />
                                </div>

                                <div class="flex items-start gap-4">
                                    <img
                                        v-if="
                                            item?.fields?.author?.fields
                                                ?.photo?.[0]?.fields?.file?.url
                                        "
                                        class="bg-tertiary size-8 rounded-full p-px"
                                        :src="`${
                                            item.fields.author.fields
                                                ?.photo?.[0]?.fields?.file?.url
                                        }?w=30&h=30&fit=fill&f=face&fm=webp`"
                                        :alt="item.fields.author?.fields?.name"
                                    />
                                    <u-badge
                                        v-if="item.fields.sticky"
                                        variant="outline"
                                        color="neutral"
                                        label="Pinned"
                                        icon="i-ic-baseline-push-pin"
                                    />
                                </div>
                            </div>
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
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'noticeBoard',
        order: '-sys.createdAt',
        select: 'fields.title,fields.sticky,fields.content,fields.author,sys.updatedAt,sys.createdAt',
        'fields.locations.sys.id[in]': activeLocationId.value,
        include: 1,
        limit: 100
    }))
})

watch(data, (newData) => {
    if (newData) {
        const fourteenDaysAgo = new Date()
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
        notices.value = newData?.items?.filter((item: TypeNoticeBoard) => {
            const updatedAt = new Date(item.sys.createdAt)
            return item.fields.sticky || updatedAt >= fourteenDaysAgo
        })
    }
})
</script>
