<template>
    <div class="flex w-full">
        <u-select-menu
            v-if="locationsReduced"
            v-model="value"
            :items="locationsReduced"
            class="w-30"
        />
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const allLocations: ComputedRef<TypeLocation[] | null> = computed(() => {
    return locationsStore.allLocations
})

const value = computed<string | undefined>({
    get() {
        return locationsStore.activeLocation?.fields.postcode
    },
    set(newPostcode: string | undefined) {
        if (!newPostcode) return
        const location = allLocations.value?.find(
            (loc) => loc.fields.postcode === newPostcode
        )
        if (location) {
            locationsStore.activeLocation = location
            // Force all fetches to refetch data
        }
    }
})

const locationsReduced: ComputedRef<string[] | null> = computed(() => {
    return allLocations.value
        ? allLocations.value.map((location) => location.fields.postcode)
        : null
})

const { data } = useFetch('/api/contentful/fetch-entries', {
    params: computed(() => ({
        content_type: 'location'
    }))
})

watch(
    data,
    (newData) => {
        if (newData) {
            // @ts-expect-error Always items
            locationsStore.allLocations = data.value?.items
            // @ts-expect-error Always total
            locationsStore.totalLocations = data.value?.total
            // @ts-expect-error Always items
            locationsStore.activeLocation = data.value?.items?.[0] || null
        }
    },
    { immediate: true }
)
</script>
