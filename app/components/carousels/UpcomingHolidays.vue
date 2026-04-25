<template>
    <div v-if="absences === null || hasAbsences" class="p-c-default">
        <carousel-title-and-action title="Upcoming Holidays" />
        <div class="relative">
            <transition name="fade">
                <div v-if="hasAbsences" class="flex gap-4 overflow-x-auto pb-1">
                    <card-absence
                        v-for="absence in absences"
                        :key="absence.id"
                        :absence="absence"
                    />
                </div>
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop v-if="absences === null" />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { data } = await useFetch<{ absence: RotareadyAbsence[] } | null>(
    '/api/rotaready/get-absence',
    {
        lazy: true,
        server: false
    }
)

const absences: ComputedRef<RotareadyAbsence[] | null> = computed(() => {
    if (!data.value) return null
    return data.value.absence ?? []
})

const hasAbsences: ComputedRef<boolean> = computed(
    () => !!absences.value && absences.value.length > 0
)
</script>
