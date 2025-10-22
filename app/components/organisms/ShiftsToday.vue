<template>
    <div v-if="shiftsInLocation.length" class="">
        <carousel-title-and-action title="Today's Team">
            <span class="pr-2">
                <u-badge size="xs" variant="outline">
                    {{ dateConverterWithDayNoYear(todayDate.toString()) }}
                </u-badge>
                <u-button @click="refreshAllAttendance"> Refresh </u-button>
            </span>
        </carousel-title-and-action>
        <div class="flex flex-col gap-1">
            <div v-for="item in shiftsInLocation" :key="item.id">
                <single-shift-today :shift="item" />
            </div>
        </div>
    </div>
    <div v-else class="">
        <p class="uc-text uc-text--xs py-24 text-center">
            No shifts scheduled in Rotaready for
            {{ dateConverterWithDayNoYear(todayDate.toString()) }}.
        </p>
    </div>
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
        key: `shiftsToday:${todayStr}`,
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

const attendanceKeys = useState<Set<string>>('attendance:keys', () => new Set())
async function refreshAllAttendance() {
    const keys = [...attendanceKeys.value, `shiftsToday:${todayStr}`]
    if (keys.length) await refreshNuxtData(keys) // ✅ string[]
}
</script>
