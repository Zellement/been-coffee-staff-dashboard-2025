<template>
    <div class="grid grid-cols-1">
        <template v-for="(item, i) in remainingEmployees" :key="item.sys.id">
            <div class="flex items-center justify-between gap-2 py-2">
                <div class="flex flex-row items-center gap-2">
                    <p class="text-xl opacity-10">
                        {{ padNumber(i + 4) }}
                    </p>
                    <u-drawer>
                        <button>
                            <img
                                v-if="
                                    item.fields.photo &&
                                    item.fields.photo.length > 0
                                "
                                class="hexagon-clip relative z-10 -mb-8 size-10 shrink-0 -translate-y-1/2 rounded-full"
                                :src="`${
                                    item.fields.photo[0].fields.file.url
                                }?w=90&h=90&fit=fill&f=face&fm=webp`"
                                :alt="`${item.fields.name} ${item.fields.surname}`"
                            />
                        </button>

                        <template #content>
                            <div class="h-full overflow-y-scroll">
                                <ul class="flex flex-row flex-wrap gap-3 p-2">
                                    <li
                                        v-for="task in item?.thisPeriodTasks"
                                        :key="task.taskName"
                                        class="flex"
                                    >
                                        <u-avatar-group>
                                            <u-badge color="neutral">{{
                                                task.taskName
                                            }}</u-badge>
                                            <u-badge
                                                :label="`${fullDateConverter(task.date)} @ ${extractHourAndMinute(
                                                    task.date
                                                )}`"
                                                color="tertiary"
                                            />
                                        </u-avatar-group>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </u-drawer>
                    <p class="flex flex-col items-center">
                        <span>{{ item.fields.name }}</span>
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <p class="uc-text text-lg leading-none">
                        {{ item.thisPeriodMinutes }}
                    </p>
                    <p class="uc-text uc-text--2xs">
                        minutes<br />
                        logged
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
const staffLeaderboardStore = useStaffLeaderboardStore()
const { fullDateConverter, extractHourAndMinute } = useDateUtils()

const employeeLeaderboard: ComputedRef<TypeEmployee[]> = computed(() => {
    return staffLeaderboardStore.employeeLeaderboard || []
})

const remainingEmployees: ComputedRef<TypeEmployee[]> = computed(() => {
    return employeeLeaderboard.value.slice(3, 9)
})

const padNumber = (num: number): string => num.toString().padStart(2, '0')
</script>
