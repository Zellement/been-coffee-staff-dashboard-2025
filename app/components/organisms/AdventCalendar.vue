<template>
    <div class="p-default col-span-full flex flex-col">
        <carousel-title-and-action title="Advent Calendar">
            <u-switch
                v-model="openAll"
                size="sm"
                class="ml-auto"
                label="Open all"
            />
        </carousel-title-and-action>
        <div
            class="calendar grid grid-cols-4 gap-1 lg:grid-cols-6 2xl:grid-cols-12"
        >
            <single-advent-door
                v-for="(day, index) in days"
                :key="index"
                :day="day.writtenFormat"
                :is-open="openAll"
                :winners="data?.items?.[0]?.fields[day.contentfulFieldName]"
            />
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
    key: 'adventCalendar',
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

const days = [
    {
        dayNumber: 1,
        writtenFormat: '1st',
        contentfulFieldName: 'winner1st'
    },
    {
        dayNumber: 2,
        writtenFormat: '2nd',
        contentfulFieldName: 'winner2nd'
    },
    {
        dayNumber: 3,
        writtenFormat: '3rd',
        contentfulFieldName: 'winner3rd'
    },
    {
        dayNumber: 4,
        writtenFormat: '4th',
        contentfulFieldName: 'winner4th'
    },
    {
        dayNumber: 5,
        writtenFormat: '5th',
        contentfulFieldName: 'winner5th'
    },
    {
        dayNumber: 6,
        writtenFormat: '6th',
        contentfulFieldName: 'winner6th'
    },
    {
        dayNumber: 7,
        writtenFormat: '7th',
        contentfulFieldName: 'winner7th'
    },
    {
        dayNumber: 8,
        writtenFormat: '8th',
        contentfulFieldName: 'winner8th'
    },
    {
        dayNumber: 9,
        writtenFormat: '9th',
        contentfulFieldName: 'winner9th'
    },
    {
        dayNumber: 10,
        writtenFormat: '10th',
        contentfulFieldName: 'winner10th'
    },
    {
        dayNumber: 11,
        writtenFormat: '11th',
        contentfulFieldName: 'winner11th'
    },
    {
        dayNumber: 12,
        writtenFormat: '12th',
        contentfulFieldName: 'winner12th'
    },
    {
        dayNumber: 13,
        writtenFormat: '13th',
        contentfulFieldName: 'winner13th'
    },
    {
        dayNumber: 14,
        writtenFormat: '14th',
        contentfulFieldName: 'winner14th'
    },
    {
        dayNumber: 15,
        writtenFormat: '15th',
        contentfulFieldName: 'winner15th'
    },
    {
        dayNumber: 16,
        writtenFormat: '16th',
        contentfulFieldName: 'winner16th'
    },
    {
        dayNumber: 17,
        writtenFormat: '17th',
        contentfulFieldName: 'winner17th'
    },
    {
        dayNumber: 18,
        writtenFormat: '18th',
        contentfulFieldName: 'winner18th'
    },
    {
        dayNumber: 19,
        writtenFormat: '19th',
        contentfulFieldName: 'winner19th'
    },
    {
        dayNumber: 20,
        writtenFormat: '20th',
        contentfulFieldName: 'winner20th'
    },
    {
        dayNumber: 21,
        writtenFormat: '21st',
        contentfulFieldName: 'winner21st'
    },
    {
        dayNumber: 22,
        writtenFormat: '22nd',
        contentfulFieldName: 'winner22nd'
    },
    {
        dayNumber: 23,
        writtenFormat: '23rd',
        contentfulFieldName: 'winner23rd'
    },
    {
        dayNumber: 24,
        writtenFormat: '24th',
        contentfulFieldName: 'winner24th'
    }
]
</script>
