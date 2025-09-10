<template>
    <div class="flex flex-col items-center gap-2">
        <h2 class="uc-text">
            <template v-if="props.title">
                {{ props.title }}
            </template>
            <template v-else>
                Today:
                <span>{{
                    dateConverterWithDayNoYear(plusDays.toISOString())
                }}</span>
            </template>
        </h2>
        <div class="flex flex-col">
            <div
                class="flex size-20 flex-col items-center overflow-hidden rounded-full border-2 border-white bg-white shadow-lg"
            >
                <span
                    class="text-md flex w-full basis-1/2 font-bold uppercase"
                    :class="dayDotConverter[getDayNumeric(plusDays)]?.classes"
                >
                    <span class="m-auto pt-1">{{ getDayAlpha(plusDays) }}</span>
                </span>
                <span
                    class="flex w-full basis-1/2 text-base font-bold tracking-tighter"
                >
                    <span class="m-auto -translate-y-0.5 text-black">
                        {{ getDate(plusDays) }} / {{ getMonth(plusDays) }}
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    title: string | null
    daysPlus: number | null
}

const props = defineProps<Props>()

const plusDays = computed(() => {
    return new Date(
        new Date().getTime() + (props.daysPlus ?? 0) * 24 * 60 * 60 * 1000
    )
})

const { dateConverterWithDayNoYear } = useDateUtils()

const getDayNumeric = (date: Date) => {
    return date.getDay()
}

const getDayAlpha = (date: Date) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return dayNames[date.getDay()]
}

const getDate = (date: Date) => {
    return date.getDate()
}

const getMonth = (date: Date) => {
    return date.getMonth() + 1
}

const dayDotConverter = [
    {
        classes: 'bg-black text-white'
    },
    {
        classes: 'bg-blue-400 text-white'
    },
    {
        classes: 'bg-yellow-500 text-black'
    },
    {
        classes: 'bg-red-500 text-white'
    },
    {
        classes: 'bg-yellow-800 text-white'
    },
    {
        classes: 'bg-green-500 text-white'
    },
    {
        classes: 'bg-orange-500 text-white'
    }
]
</script>
