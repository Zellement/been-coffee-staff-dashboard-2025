<template>
    <transition name="fade">
        <div v-if="shiftsInLocation.length" class="">
            <carousel-title-and-action title="Today's Team">
                <span class="pr-2">
                    <u-badge size="xs" variant="outline">
                        {{ dateConverterWithDayNoYear(todayDate.toString()) }}
                    </u-badge>
                </span>
            </carousel-title-and-action>
            <div class="flex flex-col gap-1">
                <div v-for="item in shiftsInLocation" :key="item.id">
                    <single-shift :shift="item" />
                </div>
            </div>
        </div>
        <div v-else>
            <p class="uc-text uc-text--xs py-4 text-center">
                No shifts scheduled in Rotaready for today.
            </p>
        </div>
    </transition>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const { backwardsDate, dateConverterWithDayNoYear } = useDateUtils()

function getMockedToday(): Date {
    const param = useRoute().query.mockDate as string | undefined
    return param ? new Date(param) : new Date()
}

const todayDate = getMockedToday()
todayDate.setHours(0, 0, 0, 0)
const todayStr = backwardsDate(todayDate)

// Example for tomorrow:
const tomorrowDate = new Date(todayDate)
tomorrowDate.setDate(tomorrowDate.getDate() + 1)
const tomorrowStr = backwardsDate(tomorrowDate)

const { data: shiftsToday } = await useFetch('/api/rotaready/get-shifts', {
    params: {
        startDateMin: todayStr,
        startDateMax: tomorrowStr,
        endDateMin: todayStr,
        endDateMax: tomorrowStr
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
</script>
