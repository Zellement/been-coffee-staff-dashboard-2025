<template>
    <div class="relative pr-2">
        <div v-if="events?.events">
            <carousel-title-and-action title="Today's Events">
                <span class="flex items-center gap-2">
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
            <div class="flex flex-col gap-2.5">
                <single-event
                    v-for="item in transformedEvents"
                    :key="item?.userId"
                    :single-event="item"
                >
                </single-event>
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
                class="absolute inset-0 flex bg-seashell-50/50 backdrop-blur-sm dark:bg-primary-900/80 dark:text-white"
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

const isRefreshing: Ref<boolean> = ref(false)
const lastUpdated: Ref<string> = ref('')

const { getTime } = useDateUtils()

interface Props {
    date: string
    nextDate: string
}

const props = defineProps<Props>()

const locationsStore = useLocationsStore()
const operationsStore = useOperationsStore()

const dateStr = props.date

const { data: events } = await useFetch<RotareadyAttendance | null>(
    '/api/rotaready/get-events',
    {
        key: 'events',
        params: {
            date: dateStr
        }
    }
)

// Rotaready clock events don't record which site they happened at, so today's
// rota is used to decide which location a clock-in belongs to
const { data: shiftsToday } = await useFetch<{ shifts: RotareadyShift[] }>(
    '/api/rotaready/get-shifts',
    {
        key: 'events-shifts',
        params: {
            startDateMin: props.date,
            startDateMax: props.nextDate,
            endDateMin: props.date,
            endDateMax: props.nextDate
        }
    }
)

lastUpdated.value = new Date().toString()

const { getTeamMemberById } = useRotareadyUtils()

const transformedEvents: ComputedRef<TransformedUser[]> = computed(() => {
    const postcode = locationsStore.activeLocation?.fields.postcode
    const shopShifts: RotareadyShift[] = (
        shiftsToday.value?.shifts ?? []
    ).filter(
        (shift: RotareadyShift): boolean =>
            !shift.workEntityName.includes('Head Office')
    )

    /**
     * Rota'd at a shop today: show them only at that shop, wherever their home
     * team is (covers cross-site shifts). Otherwise (Head Office or
     * unrostered) fall back to this location's team or leadership.
     */
    const belongsHere = (userId: number): boolean => {
        const userShopShifts = shopShifts.filter(
            (shift: RotareadyShift): boolean => shift.user?.id === userId
        )

        if (userShopShifts.length) {
            return userShopShifts.some(
                (shift: RotareadyShift): boolean =>
                    !!postcode && shift.workEntityName.includes(postcode)
            )
        }

        const isMatch = (member: TypeEmployee): boolean =>
            member.fields.rotareadyId === userId

        return !!(
            locationsStore.getAllTeamMembers?.find(isMatch) ??
            operationsStore.getLeadershipTeam?.find(isMatch)
        )
    }

    const getEventType = (eventCode: number) => {
        const eventTypes: string[] = [
            '_Blank',
            'Clocked in',
            'Clocked out',
            'Break on',
            'Break off'
        ]

        return eventTypes[eventCode] || 'Unknown Event'
    }

    const getIcon = (eventCode: number) => {
        const eventIcons: string[] = [
            'i-material-symbols-help-outline',
            'i-material-symbols-login',
            'i-material-symbols-logout',
            'ph:armchair-thin',
            'ph:armchair-fill'
        ]

        return eventIcons[eventCode] || 'i-material-symbols-help-outline'
    }

    const getColor = (eventCode: number) => {
        const eventColors: string[] = [
            'gray',
            'success',
            'error',
            'success',
            'error'
        ]

        return eventColors[eventCode] || 'gray'
    }

    const getVariant = (eventCode: number) => {
        const eventVariants: string[] = [
            'solid',
            'solid',
            'solid',
            'subtle',
            'subtle'
        ]

        return eventVariants[eventCode] || 'solid'
    }

    if (!events.value?.events) return []

    // Loop over each event, and add the userId and userName to each event object
    // Make sure no duplicates

    const users = new Set(events.value.events.map((event) => event.userId))

    const userArray = Array.from(users)

    const transformed = userArray.map((userId) => {
        if (!locationsStore.getAllTeamMembers) return null
        const userEvents = events.value!.events.filter(
            (event) => event.userId === userId
        )

        if (!belongsHere(userId)) return null

        const teamMember = getTeamMemberById(userId)
        const userShift = shopShifts.find(
            (shift: RotareadyShift): boolean => shift.user?.id === userId
        )

        return {
            userId,
            // Fall back to Rotaready's name for anyone not set up in Contentful
            userName: teamMember?.fields.name ?? userShift?.user?.firstName,
            userPhoto: teamMember?.fields.photo?.[0]?.fields?.file?.url as
                | string
                | null,
            events:
                userEvents.map((event) => ({
                    title: `${getTime(event.date)}`,
                    description: getEventType(event.eventType),
                    icon: getIcon(event.eventType),
                    color: getColor(event.eventType),
                    variant: getVariant(event.eventType)
                })) || []
        }
    })

    return transformed.filter(
        (user) => user !== null
    ) as unknown as TransformedUser[]
})

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
    await refreshNuxtData(['events', 'events-shifts'])
    isRefreshing.value = false
    lastUpdated.value = new Date().toString()
}
</script>
