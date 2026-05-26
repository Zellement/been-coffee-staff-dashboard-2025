<template>
    <u-badge
        v-if="nextBankHolidayInEngland?.date"
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
const today = new Date()
const { data } = await useFetch<BankHolidayResponse>(
    config.public.BANK_HOLIDAY_API
)

const nextBankHolidayInEngland = computed(() => {
    const englandAndWales = data.value?.['england-and-wales']
    if (!englandAndWales) return null

    const upcomingHolidays = englandAndWales.events.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= today
    })

    return upcomingHolidays.length > 0 ? upcomingHolidays[0] : null
})

const nextBankHolidayIsIn21DaysOrLess = computed(() => {
    if (!nextBankHolidayInEngland.value) return false

    const eventDate = new Date(nextBankHolidayInEngland.value.date)
    const timeDiff = eventDate.getTime() - today.getTime()
    const daysDiff = timeDiff / (1000 * 3600 * 24)

    return daysDiff <= 21
})
</script>
