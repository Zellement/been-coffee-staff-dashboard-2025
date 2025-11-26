<template>
    <div class="p-c-default">
        <carousel-title-and-action
            :title="`From ${periodStartString} until the end of this month`"
        />
        <div class="grid grid-cols-3 gap-4">
            <template v-for="(item, i) in topThreeEmployees" :key="item.sys.id">
                <div
                    :class="getColumnData(i).classes"
                    class="flex flex-col items-center gap-2 rounded-tl-lg rounded-tr-lg bg-linear-to-b py-4"
                >
                    <img
                        v-if="item.fields.photo && item.fields.photo.length > 0"
                        class="bg-tertiary relative z-10 size-16 shrink-0 rounded-full p-px"
                        :src="`${
                            item.fields.photo[0].fields.file.url
                        }?w=90&h=90&fit=fill&f=face&fm=webp`"
                        :alt="`${item.fields.name} ${item.fields.surname}`"
                    />
                    <u-icon
                        v-if="getColumnData(i).icon"
                        size="40"
                        :name="getColumnData(i).icon || ''"
                        class="animate-swing origin-top -translate-y-4"
                    />
                    <p class="flex flex-col items-center">
                        <span>{{ item.fields.name }}</span>
                        <span>{{ item.fields.surname }}</span>
                    </p>
                    <div class="">
                        {{ item.thisPeriodMinutes }} minutes logged
                    </div>
                </div>
            </template>
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

interface ColumnData {
    classes: string
    icon?: string
}

const getColumnData = (index: number): ColumnData => {
    switch (index) {
        case 0:
            return {
                classes: 'col-start-2 from-yellow-500 to-yellow-700 text-black',
                icon: 'i-hugeicons-medal-first-place'
            }
        case 1:
            return {
                classes: 'col-start-1 from-slate-500 to-slate-700 text-white',
                icon: 'i-hugeicons-medal-second-place'
            }
        case 2:
            return {
                classes: 'col-start-3 from-yellow-800 to-yellow-900 text-white',
                icon: 'i-hugeicons-medal-third-place'
            }
        default:
            return { classes: '', icon: 'i-hugeicons-medal-third-place' }
    }
}

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

<style scoped>
@keyframes swing {
    0% {
        transform: rotate3d(0, 0, 1, -10deg);
    }
    50% {
        transform: rotate3d(0, 0, 1, 10deg);
    }
    100% {
        transform: rotate3d(0, 0, 1, -10deg);
    }
}

.animate-swing {
    animation: swing 3s ease-in-out infinite;
}
</style>
