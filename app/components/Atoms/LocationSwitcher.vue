<template>
    <div class="flex">
        <u-select
            v-if="locationsReduced"
            v-model="value"
            :items="locationsReduced"
            class="w-full"
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
        ? allLocations.value.map((location) => location.fields?.postcode)
        : null
})
</script>
