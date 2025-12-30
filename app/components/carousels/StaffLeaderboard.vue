<template>
    <div class="p-default">
        <carousel-title-and-action :title="`Task Leaderboard`">
            <div class="flex items-center gap-2">
                <u-button
                    size="2xs"
                    color="tertiary"
                    :ui="{
                        base: 'p-1.5 leading-none'
                    }"
                    @click="refreshLeaderboard"
                >
                    Refresh
                </u-button>
                <u-popover>
                    <u-button
                        icon="material-symbols:info-outline"
                        label="Whats this?"
                        size="2xs"
                        variant="soft"
                    />
                    <template #content>
                        <div class="max-w-40 p-1 text-xs">
                            This leaderboard showcases the top-performing staff
                            members based on the number of routine task minutes
                            they have 'collected'. It counts from the start of
                            every pay period.
                        </div>
                    </template>
                </u-popover>
                <p class="uc-text uc-text--2xs">
                    Since {{ periodStartString }}
                </p>
            </div>
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
import StaffLeaderboardTopThree from '~/components/molecules/StaffLeaderboardTopThree.vue'
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
        component: StaffLeaderboardTopThree
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
    key: 'employee',
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

async function refreshLeaderboard() {
    staffLeaderboardStore.cachedEmployees = null
}

watch(data, (newData) => {
    if (newData) {
        staffLeaderboardStore.cachedEmployees = newData.items || []
        staffLeaderboardStore.lastFetched = new Date()
    }
})
</script>
