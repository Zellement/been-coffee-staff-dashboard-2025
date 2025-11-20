<template>
    <div class="p-default col-span-full">
        <u-switch v-model="openAll" class="mb-4" label="Open all" />
        <div
            class="calendar grid grid-cols-4 gap-1 lg:grid-cols-6 2xl:grid-cols-12"
        >
            <single-advent-door
                v-for="(day, index) in days"
                :key="index"
                :day="day"
                :is-open="openAll"
            />

            <div
                v-for="employee in data?.items?.[0]?.fields.winner1st"
                :key="employee?.sys?.id"
            >
                <u-avatar-group>
                    <img
                        v-if="getTeamMember(employee?.sys?.id).photo"
                        class="bg-tertiary size-8 shrink-0 rounded-full p-px"
                        :src="`${getTeamMember(employee?.sys?.id).photo}?w=90&h=90&fit=fill&f=face&fm=webp`"
                        :alt="getTeamMember(employee?.sys?.id).name"
                    />
                </u-avatar-group>
                {{ getTeamMember(employee?.sys?.id).name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const activeLocationId: ComputedRef<string | undefined> = computed(() => {
    return locationsStore.activeLocation?.sys.id
})

const shouldFetch: ComputedRef<boolean> = computed(
    () => locationsStore.safeToFetchAllData
)

const openAll = ref(false)

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'beenAwesomeWinners',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'adventCalendar',
        'fields.location.sys.id': activeLocationId.value,
        include: 0
    }))
})

const getTeamMember = (id: string) => {
    const member = locationsStore?.getAllTeamMembers?.find(
        (member) => member?.sys?.id === id
    )
    return {
        name: member?.fields?.name || 'Unknown',
        photo: member?.fields?.photo?.[0]?.fields?.file?.url || []
    }
}

const days = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
    '11th',
    '12th',
    '13th',
    '14th',
    '15th',
    '16th',
    '17th',
    '18th',
    '19th',
    '20th',
    '21st',
    '22nd',
    '23rd',
    '24th'
]
</script>
