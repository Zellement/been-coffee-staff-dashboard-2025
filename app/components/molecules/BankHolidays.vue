<template>
    <u-badge
        v-if="nextBankHolidayIsWithinWindow"
        :color="colorMode.value === 'dark' ? 'secondary' : 'primary'"
        variant="solid"
        class="mdgap-1 flex flex-col md:flex-row"
    >
        <span class="-mb-3 text-2xs md:m-0 md:text-xs">
            Upcoming Bank Holiday:
        </span>
        {{
            nextBankHolidayInEngland?.date
                ? useDateFormat(nextBankHolidayInEngland?.date, 'ddd DD MMM ')
                : ''
        }}
    </u-badge>
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
interface BankHolidayEvent {
    date: string
    [key: string]: unknown
}

interface BankHolidayDivision {
    events: BankHolidayEvent[]
}

interface BankHolidayResponse {
    'england-and-wales'?: BankHolidayDivision
}
const colorMode = useColorMode()

const config = useRuntimeConfig()

// Only flag bank holidays coming up within the next four weeks
const BANK_HOLIDAY_WINDOW_DAYS = 28

// Start of today, so the badge still shows on the bank holiday itself
const today = new Date()
today.setHours(0, 0, 0, 0)
const { data } = await useFetch<BankHolidayResponse>(
    config.public.BANK_HOLIDAY_API
)

const nextBankHolidayInEngland = computed(() => {
    const englandAndWales = data.value?.['england-and-wales']
    if (!englandAndWales) return null

    const upcomingHolidays = englandAndWales.events.filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
    })

    return upcomingHolidays.length > 0 ? upcomingHolidays[0] : null
})

const nextBankHolidayIsWithinWindow: ComputedRef<boolean> = computed(
    (): boolean => {
        if (!nextBankHolidayInEngland.value) return false

        const eventDate = new Date(nextBankHolidayInEngland.value.date)
        eventDate.setHours(0, 0, 0, 0)
        const timeDiff = eventDate.getTime() - today.getTime()
        const daysDiff = timeDiff / (1000 * 3600 * 24)

        return daysDiff <= BANK_HOLIDAY_WINDOW_DAYS
    }
)
</script>
