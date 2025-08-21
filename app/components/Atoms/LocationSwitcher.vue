<template>
    <div class="flex w-full">
        <u-select-menu
            v-if="locations"
            v-model="value"
            :items="locations"
            class="w-30"
        />
    </div>
</template>

<script lang="ts" setup>
const { fetchLocations } = useLocationUtils()

const locationsStore = useLocationsStore()

const allLocations: ComputedRef<TypeLocation[] | null> = computed(() => {
    return locationsStore.allLocations
})

const value: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.fields.postcode || undefined
})

const locations: ComputedRef<string[] | null> = computed(() => {
    return allLocations.value
        ? allLocations.value.map((location) => location.fields.postcode)
        : null
})

fetchLocations()
</script>
