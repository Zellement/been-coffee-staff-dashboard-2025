<template>
    <div class="grid grid-cols-3 grid-rows-10 gap-6">
        <template v-for="(item, i) in topThreeEmployees" :key="item.sys.id">
            <div
                :class="getColumnData(i).classes"
                class="mt-8 flex flex-col items-center gap-2 rounded-tl-2xl rounded-tr-2xl bg-linear-to-b pb-4"
            >
                <u-drawer>
                    <button>
                        <img
                            v-if="
                                item.fields.photo &&
                                item.fields.photo.length > 0
                            "
                            class="hexagon-clip relative z-10 -mb-8 size-16 shrink-0 -translate-y-1/2 rounded-full"
                            :src="`${
                                item.fields.photo[0].fields.file.url
                            }?w=90&h=90&fit=fill&f=face&fm=webp`"
                            :alt="`${item.fields.name} ${item.fields.surname}`"
                        />
                    </button>

                    <template #content>
                        <ul class="flex flex-col gap-2 p-2">
                            <li
                                v-for="task in item?.thisPeriodTasks"
                                :key="task.taskName"
                                class="flex gap-1"
                            >
                                <u-badge>{{ task.taskName }}</u-badge>
                                <u-field-group>
                                    <u-badge
                                        :label="fullDateConverter(task.date)"
                                        color="tertiary"
                                    />
                                    <u-badge
                                        :label="extractHourAndMinute(task.date)"
                                        color="tertiary"
                                    />
                                </u-field-group>
                            </li>
                        </ul>
                    </template>
                </u-drawer>
                <u-icon
                    v-if="getColumnData(i).icon"
                    :size="getColumnData(i).iconSize || '40'"
                    :name="getColumnData(i).icon || ''"
                    class="animate-swing -mb-5 size-12 origin-top -translate-y-5"
                    :class="getColumnData(i).iconClasses"
                />
                <p class="flex flex-col items-center">
                    <span>{{ item.fields.name }}</span>
                </p>
                <p
                    class="uc-text text-xl leading-none"
                    :class="getColumnData(i).minutesClasses"
                >
                    {{ item.thisPeriodMinutes }}
                </p>
                <p
                    class="uc-text uc-text--2xs -translate-y-1 text-center leading-none"
                    :class="getColumnData(i).minutesClasses"
                >
                    minutes<br />
                    logged
                </p>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
interface ColumnData {
    classes: string
    icon?: string
    iconSize?: string
    iconClasses?: string
    minutesClasses?: string
}

const { fullDateConverter, extractHourAndMinute } = useDateUtils()

const staffLeaderboardStore = useStaffLeaderboardStore()

const employeeLeaderboard: ComputedRef<TypeEmployee[]> = computed(() => {
    return staffLeaderboardStore.employeeLeaderboard || []
})

const topThreeEmployees: ComputedRef<TypeEmployee[]> = computed(() => {
    return employeeLeaderboard.value.slice(0, 3)
})

const getColumnData = (index: number): ColumnData => {
    switch (index) {
        case 0:
            return {
                classes:
                    'col-start-2 row-span-full row-start-1 from-butterscotch-500 to-butterscotch-600 dark:text-navy-500!',
                icon: 'i-hugeicons-medal-first-place',
                iconSize: '48',
                iconClasses: 'text-butterscotch-200 ',
                minutesClasses: 'text-navy-500!'
            }
        case 1:
            return {
                classes:
                    'col-start-1 row-span-8 row-start-3 from-navy-500 to-navy-600 text-white',
                icon: 'i-hugeicons-medal-second-place',
                iconSize: '40',
                iconClasses: 'text-navy-400',
                minutesClasses: 'text-navy-400!'
            }
        case 2:
            return {
                classes:
                    'col-start-3 row-span-6 row-start-5 from-tuscany-500 to-tuscany-600 text-white',
                icon: 'i-hugeicons-medal-third-place',
                iconSize: '32',
                iconClasses: 'text-tuscany-300',
                minutesClasses: 'text-tuscany-300!'
            }
        default:
            return { classes: '', icon: 'i-hugeicons-medal-third-place' }
    }
}
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
