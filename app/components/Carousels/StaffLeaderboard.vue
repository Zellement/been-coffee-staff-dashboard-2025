<template>
    <div class="p-default">
        <carousel-title-and-action :title="`Task Leaderboard`">
            <p class="uc-text uc-text--2xs">
                {{ periodStartString }} - end of this month
            </p>
        </carousel-title-and-action>

        <staff-leaderboard-top3 :employees="topThreeEmployees" />
        <!-- <u-carousel
            v-slot="{ item }"
            :items="topThreeEmployees"
            :ui="{
                item: itemClasses ?? 'basis-full'
            }"
        >
            {{ item.fields.name }} {{ item.fields.surname }}
        </u-carousel> -->
        <!-- <pre>{{ employeeLeaderboard }}</pre> -->
    </div>
</template>

<script lang="ts" setup>
interface Props {
    itemClasses?: string
}

defineProps<Props>()

const { getPayPeriodStartFrom, shortDateConverter } = useDateUtils()

const today = new Date()
const { periodStart } = getPayPeriodStartFrom(today)
const periodStartString = shortDateConverter(new Date(periodStart))

const staffLeaderboardStore = useStaffLeaderboardStore()

// const { shortDateConverter, shortDateConverter } = useDateUtils()

const employeeLeaderboard: ComputedRef<TypeEmployee[]> = computed(() => {
    return staffLeaderboardStore.employeeLeaderboard || []
})

const topThreeEmployees: ComputedRef<TypeEmployee[]> = computed(() => {
    return employeeLeaderboard.value.slice(0, 3)
})

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
