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
                    v-for="item in teamEvents"
                    :key="item?.userId"
                    :single-event="item"
                >
                </single-event>
            </div>
            <div
                v-if="roamingEvents.length"
                class="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-butterscotch-300 bg-butterscotch-100 p-2.5 dark:border-navy-400 dark:bg-navy-700"
            >
                <div
                    v-for="item in roamingEvents"
                    :key="item.userId"
                    class="flex flex-col gap-1.5"
                >
                    <div class="flex items-center gap-1.5 text-xs">
                        <u-badge
                            size="xs"
                            variant="subtle"
                            color="neutral"
                            :icon="
                                item.shiftType === 'Admin'
                                    ? 'i-material-symbols-laptop-mac-outline'
                                    : 'i-material-symbols-coffee-outline'
                            "
                            :label="item.shiftType ?? 'Working today'"
                        />
                        <u-badge
                            v-if="item.clockedInAt"
                            size="xs"
                            :variant="item.clockedInHere ? 'solid' : 'outline'"
                            :color="item.clockedInHere ? 'success' : 'primary'"
                            :label="getSiteLabel(item)"
                        />
                    </div>
                    <single-event :single-event="item" />
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

/**
 * Roles that move between the shops day to day. They show on every location's
 * view, apart from the rest of the team, with the shop they are working at.
 */
const ROAMING_ROLES: string[] = ['Manager']

const isRoaming = (userId: number): boolean =>
    ROAMING_ROLES.includes(getTeamMemberById(userId)?.fields.jobRole ?? '')

const isHeadOffice = (shift: RotareadyShift): boolean =>
    shift.workEntityName.includes('Head Office')

/**
 * "Head Office" is not a real site, only a Rotaready entity used to separate
 * wages, so it is never treated as somewhere someone is working.
 */
const shopShifts: ComputedRef<RotareadyShift[]> = computed(
    (): RotareadyShift[] =>
        (shiftsToday.value?.shifts ?? []).filter(
            (shift: RotareadyShift): boolean => !isHeadOffice(shift)
        )
)

/**
 * Rotaready clock events carry no site (and the Manager's have no GPS), so the
 * current shift is the rota shift that starts closest to their latest
 * clock-in. Handles split days, e.g. NG10 in the morning then DE65. Head
 * Office shifts count here so an admin day still shows as admin.
 */
const getClockedInShift = (
    userId: number,
    userEvents: RotareadyEvent[]
): RotareadyShift | undefined => {
    const userShifts: RotareadyShift[] = (
        shiftsToday.value?.shifts ?? []
    ).filter((shift: RotareadyShift): boolean => shift.user?.id === userId)
    const lastClockIn: RotareadyEvent | undefined = [...userEvents]
        .reverse()
        .find((event: RotareadyEvent): boolean => event.eventType === 1)

    if (!lastClockIn) return userShifts[0]

    const clockInTime: number = +new Date(lastClockIn.date)
    const distance = (shift: RotareadyShift): number =>
        Math.abs(+new Date(shift.start) - clockInTime)

    return [...userShifts].sort(
        (a: RotareadyShift, b: RotareadyShift): number =>
            distance(a) - distance(b)
    )[0]
}

// Admin is its own Rotaready shift type; every other type is a bar shift
const getShiftType = (shift?: RotareadyShift): string | null => {
    if (!shift) return null
    return shift.typeName.includes('Admin') ? 'Admin' : 'Bar shift'
}

// Same wording on every shop; the badge colour shows whether it is this one
const getSiteLabel = (item: TransformedUser): string =>
    `Clocked in at ${item.clockedInAt}`

const transformedEvents: ComputedRef<TransformedUser[]> = computed(() => {
    const postcode = locationsStore.activeLocation?.fields.postcode

    /**
     * Rota'd at a shop today: show them only at that shop, wherever their home
     * team is (covers cross-site shifts). Otherwise (Head Office or
     * unrostered) fall back to this location's team or leadership.
     */
    const belongsHere = (userId: number): boolean => {
        const userShopShifts = shopShifts.value.filter(
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
        // Chronological, so the latest clock event decides their status
        const userEvents = events
            .value!.events.filter(
                (event: RotareadyEvent): boolean => event.userId === userId
            )
            .sort(
                (a: RotareadyEvent, b: RotareadyEvent): number =>
                    +new Date(a.date) - +new Date(b.date)
            )

        const roaming: boolean = isRoaming(userId)

        if (!roaming && !belongsHere(userId)) return null

        const teamMember = getTeamMemberById(userId)
        const userShift = shopShifts.value.find(
            (shift: RotareadyShift): boolean => shift.user?.id === userId
        )
        const currentShift: RotareadyShift | undefined = roaming
            ? getClockedInShift(userId, userEvents)
            : undefined
        // Head Office is a wages entity, not a place, so it is never shown
        const clockedInSite: string | null =
            currentShift && !isHeadOffice(currentShift)
                ? currentShift.workEntityName.trim()
                : null

        return {
            userId,
            isRoaming: roaming,
            shiftType: getShiftType(currentShift),
            clockedInAt: clockedInSite,
            clockedInHere: !!postcode && !!clockedInSite?.includes(postcode),
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

const teamEvents: ComputedRef<TransformedUser[]> = computed(
    (): TransformedUser[] =>
        transformedEvents.value.filter(
            (user: TransformedUser): boolean => !user.isRoaming
        )
)

const roamingEvents: ComputedRef<TransformedUser[]> = computed(
    (): TransformedUser[] =>
        transformedEvents.value.filter(
            (user: TransformedUser): boolean => user.isRoaming
        )
)

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
