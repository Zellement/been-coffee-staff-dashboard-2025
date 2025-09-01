<template>
    <pre class="">{{ reviewData }}</pre>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const dataFetched: Ref<boolean> = ref(false)
const reviewData: Ref<any> = ref(null)

const { uploadGoogleReviews } = useContentfulUtils()

const activeLocation: ComputedRef<TypeLocation | null> = computed(
    () => locationsStore.activeLocation
)

const dataLastFetched: ComputedRef<Date | null> = computed(() => {
    return activeLocation.value?.fields.reviewDataLastFetched
})

const dataFetchedToday: ComputedRef<boolean> = computed(() => {
    if (!dataLastFetched.value) return true
    const now = new Date()
    const lastFetched = new Date(dataLastFetched.value)
    return (
        lastFetched.getDate() === now.getDate() &&
        lastFetched.getMonth() === now.getMonth() &&
        lastFetched.getFullYear() === now.getFullYear()
    )
})

const shouldFetchGoogleReviews: ComputedRef<boolean> = computed(
    () =>
        !!activeLocation.value?.fields?.googlePlaceId && !dataFetchedToday.value
)

/* Functions & lifecycle */

const { data, execute } = useFetch('/api/serpapi/google-reviews', {
    key: 'googleReviews',
    lazy: true,
    server: false,
    params: computed(() => ({
        place_id: activeLocation.value?.fields?.googlePlaceId || ''
    })),
    immediate: false
})

watch(
    shouldFetchGoogleReviews,
    (ready) => {
        if (ready) {
            console.log('Fetching data...')
            execute().then(() => {
                dataFetched.value = true
                reviewData.value = data.value || []
                uploadGoogleReviews(data.value, activeLocation.value?.sys.id)
            })
        } else {
            reviewData.value = activeLocation.value?.fields?.reviewData || []
        }
    },
    { immediate: true }
)

watch(data, (newData) => {
    if (newData) {
        reviewData.value = newData || []
    }
})
</script>
