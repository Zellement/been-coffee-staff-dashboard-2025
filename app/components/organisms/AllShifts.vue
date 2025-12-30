<template>
    <div v-if="shiftsInLocation.length" class="">
        <carousel-title-and-action :title="title">
            <span class="pr-2">
                <u-badge size="xs" variant="outline">
                    {{ dateConverterWithDayNoYear(minDate) }}
                </u-badge>
            </span>
        </carousel-title-and-action>
        <div class="flex flex-col gap-1">
            <div v-for="item in shiftsInLocation" :key="item.id">
                <single-shift :shift="item" />
            </div>
            <div v-if="shiftsInHeadOffice?.length > 0" class="mt-2">
                <div
                    v-for="item in shiftsInHeadOffice"
                    :key="item.id"
                    class="rounded-full border border-butterscotch-300 bg-butterscotch-100 p-1 dark:border-navy-200/20 dark:bg-navy-900"
                >
                    <single-shift :shift="item" />
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-col gap-2">
        <u-skeleton class="h-6 w-48" />
        <div v-for="i in 4" :key="i" class="flex gap-4">
            <u-skeleton class="size-10 rounded-full" />
            <u-skeleton class="h-10 w-20 rounded" />
            <u-skeleton class="h-10 w-full rounded" />
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    title: string
    minDate: string
    maxDate: string
}

const props = defineProps<Props>()
const locationsStore = useLocationsStore()

const { dateConverterWithDayNoYear } = useDateUtils()

const { data: shiftsToday } = await useFetch('/api/rotaready/get-shifts', {
    params: {
        startDateMin: props.minDate,
        startDateMax: props.maxDate,
        endDateMin: props.minDate,
        endDateMax: props.maxDate
    }
})

const shiftsInLocation: ComputedRef<RotareadyShift[]> = computed(() => {
    return (
        shiftsToday.value?.shifts.filter((shift: RotareadyShift) =>
            shift.originEntityName.includes(
                locationsStore?.activeLocation?.fields.postcode
            )
        ) || []
    )
})

const shiftsInHeadOffice: ComputedRef<RotareadyShift[]> = computed(() => {
    return (
        shiftsToday.value?.shifts.filter((shift: RotareadyShift) =>
            shift.originEntityName.includes('Head Office')
        ) || []
    )
})
</script>
