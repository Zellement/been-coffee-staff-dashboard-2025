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
            <div class="flex flex-col gap-4.5">
                <single-event
                    v-for="item in transformedEvents"
                    :key="item?.userId"
                    :event="item"
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

const isRefreshing: Ref<boolean> = ref(false)
const lastUpdated: Ref<string> = ref(new Date().toString())

const { getTime } = useDateUtils()

interface Props {
    date: string
}

const props = defineProps<Props>()

const locationsStore = useLocationsStore()

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

const transformedEvents: ComputedRef<TransformedUser[]> = computed(() => {
    const findTeamMember = (userId: number) => {
        return locationsStore.getAllTeamMembers?.find(
            (member) => member.fields.rotareadyId === userId
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
        const userEvents = events.value!.events.filter(
            (event) => event.userId === userId
        )

        // If this userId does not exist in team members for the current location, skip it
        if (!findTeamMember(userId)) {
            console.warn(
                `User with ID ${userId} not found in this location's team members.`
            )
            return null
        }

        return {
            userId,
            userName: findTeamMember(userId)?.fields.name,
            userPhoto: findTeamMember(userId)?.fields.photo?.[0]?.fields?.file
                ?.url as string | null,
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
    await refreshNuxtData('events')
    isRefreshing.value = false
}
</script>
