<template>
    <div class="">
        {{ lastFriday }}{{ periodStart }}
        <pre>{{ allEmployees }}</pre>
    </div>
</template>

<script lang="ts" setup>
const { getPayPeriodStartFrom } = useDateUtils()

const today = new Date()
const { periodStart, lastFriday } = getPayPeriodStartFrom(today)

const staffLeaderboardStore = useStaffLeaderboardStore()

// const { fullDateConverter, shortDateConverter } = useDateUtils()

const allEmployees: ComputedRef<TypeEmployee[]> = computed(() => {
    return staffLeaderboardStore.cachedEmployees || []
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
        select: 'fields.name,fields.surname,fields.taskHistory,fields.taskHistory.*,fields.jobRole',
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
