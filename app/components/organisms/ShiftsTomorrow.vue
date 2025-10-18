<template>
    <transition name="fade">
        <div v-if="shiftsInLocation.length" class="p-default">
            <carousel-title-and-action title="Tomorrow's Team" />
            <div class="flex flex-col">
                <div v-for="shift in shiftsInLocation" :key="shift.id">
                    {{ getTeamMember(shift)?.fields?.name }}
                    {{ shift.start }} - {{ shift.end }}
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const { backwardsDate } = useDateUtils()
const { getTeamMember } = useRotareadyUtils()

function getMockedToday(): Date {
    const param = useRoute().query.mockDate as string | undefined
    return param ? new Date(param) : new Date()
}

const todayDate = getMockedToday()
todayDate.setHours(0, 0, 0, 0)

const tomorrowDate = new Date(todayDate)
tomorrowDate.setDate(tomorrowDate.getDate() + 1)
const tomorrowStr = backwardsDate(tomorrowDate)

const dayAfterTomorrowDate = new Date(tomorrowDate)
dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 1)
const dayAfterTomorrowStr = backwardsDate(dayAfterTomorrowDate)

const { data: shiftsToday } = await useFetch('/api/rotaready/get-shifts', {
    params: {
        startDateMin: tomorrowStr,
        startDateMax: dayAfterTomorrowStr,
        endDateMin: tomorrowStr,
        endDateMax: dayAfterTomorrowStr
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
