<template>
    <div class="relative">
        <pre>{{ shiftsInLocation }}</pre>
        <div v-if="shiftsInLocation.length">
            <carousel-title-and-action title="Today's Team">
                <span class="flex items-center gap-2 pr-2">
                    <u-button
                        size="2xs"
                        color="tertiary"
                        :ui="{
                            base: 'p-1.5 leading-none'
                        }"
                        @click="refreshAllAttendance"
                    >
                        Refresh
                    </u-button>
                    <u-badge
                        size="xs"
                        :ui="{
                            base: 'p-1.5 leading-none'
                        }"
                        variant="outline"
                    >
                        Last updated:
                        {{ useDateFormat(lastUpdated, 'ddd DD MMM HH:mm:ss') }}
                    </u-badge>
                </span>
            </carousel-title-and-action>
            <div class="flex flex-col gap-1">
                <div v-for="item in shiftsInLocation" :key="item.id">
                    <single-shift-today :shift="item" />
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
        <transition name="fade">
            <div
                v-if="isRefreshing"
                class="bg-seashell-50/50 dark:bg-primary-900/80 absolute inset-0 flex backdrop-blur-sm dark:text-white"
            >
                <u-icon
                    name="i-svg-spinners-blocks-shuffle-3"
                    class="m-auto"
                    size="22"
                />
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

const locationsStore = useLocationsStore()

const { backwardsDate } = useDateUtils()

function getMockedToday(): Date {
    const param = useRoute().query.mockDate as string | undefined
    return param ? new Date(param) : new Date()
}

const isRefreshing: Ref<boolean> = ref(false)
const lastUpdated: Ref<string> = ref(new Date().toString())

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

const SHIFT_REFRESH_TIMER = 900 // 15 minutes in seconds
const shiftTimer: Ref<number> = ref(0)

const { inActiveWindow } = useDateUtils()

let shiftIntervalId: number | null = null

onMounted(() => {
    shiftIntervalId = window.setInterval(() => {
        const active = inActiveWindow()

        if (!active) return // freeze timer when out of hours

        if (shiftTimer.value >= SHIFT_REFRESH_TIMER) {
            console.log('Refreshing shifts today data...', new Date())
            refreshAllAttendance()
            shiftTimer.value = 0
        } else {
            shiftTimer.value++
        }
    }, 1000)
})

onBeforeUnmount(() => {
    if (shiftIntervalId) clearInterval(shiftIntervalId)
})

async function refreshAllAttendance() {
    isRefreshing.value = true
    const keys = [...attendanceKeys.value, `shiftsToday:${todayStr}`]
    if (keys.length) await refreshNuxtData(keys) // ✅ string[]
    setTimeout(() => {
        isRefreshing.value = false
        lastUpdated.value = new Date().toString()
    }, 1000)
}
</script>
