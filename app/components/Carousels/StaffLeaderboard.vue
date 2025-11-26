<template>
    <div class="p-c-default">
        <carousel-title-and-action
            :title="`From ${periodStartString} until the end of this month`"
        />
        <div class="grid grid-cols-3 gap-4">
            <div
                v-for="item in topThreeEmployees"
                :key="item.sys.id"
                class="flex flex-col items-center gap-2"
            >
                <img
                    v-if="item.fields.photo && item.fields.photo.length > 0"
                    class="bg-tertiary size-16 shrink-0 rounded-full p-px"
                    :src="`${
                        item.fields.photo[0].fields.file.url
                    }?w=90&h=90&fit=fill&f=face&fm=webp`"
                    :alt="`${item.fields.name} ${item.fields.surname}`"
                />
                <p class="flex flex-col items-center">
                    <span>{{ item.fields.name }}</span>
                    <span>{{ item.fields.surname }}</span>
                </p>
                <div class="text-secondary text-center text-sm">
                    {{ item.thisPeriodMinutes }} minutes logged
                </div>
            </div>
        </div>
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

const { getPayPeriodStartFrom, fullDateConverter } = useDateUtils()

const today = new Date()
const { periodStart } = getPayPeriodStartFrom(today)
const periodStartString = fullDateConverter(new Date(periodStart))

const staffLeaderboardStore = useStaffLeaderboardStore()

// const { fullDateConverter, shortDateConverter } = useDateUtils()

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
