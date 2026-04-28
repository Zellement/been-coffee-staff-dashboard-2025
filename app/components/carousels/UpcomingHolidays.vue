<template>
    <div v-if="absences === null || hasAbsences" class="p-c-default">
        <carousel-title-and-action title="Upcoming Holidays" />
        <div class="relative">
            <transition name="fade">
                <div v-if="hasAbsences" class="flex gap-4">
                    <div class="min-w-0 flex-1">
                        <u-carousel
                            v-slot="{ item }"
                            :items="absences ?? []"
                            auto-height
                            drag-free
                            :ui="{ item: 'basis-48' }"
                        >
                            <card-absence :absence="item" />
                        </u-carousel>
                    </div>
                </div>
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop v-if="absences === null" />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const { data } = await useFetch<{ absence: RotareadyAbsence[] } | null>(
    '/api/rotaready/get-absence',
    {
        lazy: true,
        server: false
    }
)

const absences: ComputedRef<RotareadyAbsence[] | null> = computed(() => {
    if (!data.value) return null
    const postcode = locationsStore.activeLocation?.fields.postcode
    return data.value.absence.filter(
        (absence: RotareadyAbsence) =>
            absence.user.appointment.entityName.includes(postcode) ||
            absence.user.appointment.entityName.includes('Head Office')
    )
})

const hasAbsences: ComputedRef<boolean> = computed(
    () => !!absences.value && absences.value.length > 0
)
</script>
