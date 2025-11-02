<template>
    <div class="relative">
        <pre>{{ transformedEvents }}</pre>
        <div v-if="events?.events">
            <carousel-title-and-action title="Today's Events">
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
                <pre v-for="item in events.events" :key="item?.id">
                    {{ item }}
                </pre>
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

const date = new Date()
const dateStr = date.toISOString().split('T')[0]

const { data: events } = await useFetch<RotareadyAttendance | null>(
    '/api/rotaready/get-events',
    {
        key: 'events',
        params: {
            date: dateStr
        }
    }
)

interface TransformedEvent {
    eventType: number
    eventDate: string
}

interface TransformedUser {
    userId: number
    userName: string
    events: TransformedEvent[]
}

const transformedEvents: ComputedRef<TransformedUser[]> = computed(() => {
    if (!events.value?.events) return []

    // Loop over each event, and add the userId and userName to each event object
    // Make sure no duplicates

    const users = new Set(events.value.events.map((event) => event.userId))

    const userArray = Array.from(users)

    const transformed = userArray.map((userId) => {
        const userEvents = events.value!.events.filter(
            (event) => event.userId === userId
        )

        return {
            userId,
            userName: 'tbc',
            events:
                userEvents.map((event) => ({
                    eventType: event.eventType,
                    eventDate: event.date
                })) || []
        }
    })

    console.log(transformed)
    return transformed
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
