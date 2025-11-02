<template>
    <div class="p-c-default">
        <UCarousel
            v-slot="{ item }"
            :items="slides"
            :dots="!hideDots"
            :ui="{
                item: itemClasses ?? 'basis-full'
            }"
        >
            <component
                :is="item.component"
                v-bind="item.props"
                :title="item.props?.title"
            />
        </UCarousel>
    </div>
</template>

<script lang="ts" setup>
import AllEventsToday from '~/components/organisms/AllEventsToday.vue'
import AllShifts from '~/components/organisms/AllShifts.vue'

interface Props {
    itemClasses?: string
    hideDots?: boolean
}

const { backwardsDate } = useDateUtils()

defineProps<Props>()

function getMockedToday(): Date {
    const param = useRoute().query.mockDate as string | undefined
    return param ? new Date(param) : new Date()
}

const todayDate = getMockedToday()
todayDate.setHours(0, 0, 0, 0)
const todayStr = backwardsDate(todayDate)

const tomorrowDate = new Date(todayDate)
tomorrowDate.setDate(tomorrowDate.getDate() + 1)
const tomorrowStr = backwardsDate(tomorrowDate)

const dayAfterTomorrowDate = new Date(tomorrowDate)
dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 1)
const dayAfterTomorrowStr = backwardsDate(dayAfterTomorrowDate)

const slides: any[] = [
    { component: AllEventsToday },
    {
        component: AllShifts,
        props: {
            title: "Today's Team",
            minDate: todayStr,
            maxDate: tomorrowStr
        }
    },
    {
        component: AllShifts,
        props: {
            title: "Tomorrow's Team",
            minDate: tomorrowStr,
            maxDate: dayAfterTomorrowStr
        }
    }
]
</script>
