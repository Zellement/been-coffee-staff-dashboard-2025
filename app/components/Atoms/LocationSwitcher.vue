<template>
    <div class="">
        <u-select
            v-if="locations"
            v-model="value"
            :items="locations"
            class="w-auto"
        />
    </div>
</template>

<script lang="ts" setup>
const { fetchLocations } = useLocationUtils()

const locationsStore = useLocationsStore()

const allLocations: ComputedRef<TypeLocation[] | null> = computed(() => {
    return locationsStore.allLocations
})

const value = ref<string | undefined>(
    locationsStore.activeLocation?.fields.postcode || undefined
)

const locations: ComputedRef<string[] | null> = computed(() => {
    return allLocations.value
        ? allLocations.value.map((location) => location.fields.postcode)
        : null
})

fetchLocations()
</script>
