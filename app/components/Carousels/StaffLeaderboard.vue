<template>
    <div class="p-default">
        <carousel-title-and-action :title="`Task Leaderboard`">
            <p class="uc-text uc-text--2xs">
                Pay period starting {{ periodStartString }}
            </p>
        </carousel-title-and-action>

        <u-carousel
            v-slot="{ item }"
            :items="slides"
            :ui="{
                item: itemClasses ?? 'basis-full'
            }"
        >
            <component
                :is="item.component"
                v-bind="item.props"
                :title="item.props?.title"
            />
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
import StaffLeaderboardTop3 from '~/components/molecules/StaffLeaderboardTop3.vue'
import StaffLeaderboardRemaining from '~/components/molecules/StaffLeaderboardRemaining.vue'

interface Props {
    itemClasses?: string
}

defineProps<Props>()

const { getPayPeriodStartFrom, shortDateConverter } = useDateUtils()

const today = new Date()
const { periodStart } = getPayPeriodStartFrom(today)
const periodStartString = shortDateConverter(new Date(periodStart))

const staffLeaderboardStore = useStaffLeaderboardStore()

const slides: any[] = [
    {
        component: StaffLeaderboardTop3
    },
    {
        component: StaffLeaderboardRemaining
    }
]

/* Computed */

const shouldFetch: ComputedRef<boolean> = computed(
    () => staffLeaderboardStore.cachedEmployees === null
)

/* Functions & lifecycle */

const { data } = useFetch('/api/contentful/fetch-entries', {
    key: 'staffLeaderboard',
    lazy: true,
    server: false,
    watch: [shouldFetch],
    immediate: shouldFetch.value,
    params: computed(() => ({
        content_type: 'employee',
        select: 'fields.name,fields.surname,fields.taskHistory,fields.photo',
        order: 'fields.name',
        'fields.jobRole[nin]': '_ShopLogin,_DashLogin'
    }))
})

watch(data, (newData) => {
    if (newData) {
        staffLeaderboardStore.cachedEmployees = newData.items || []
        staffLeaderboardStore.lastFetched = new Date()
    }
})
</script>
