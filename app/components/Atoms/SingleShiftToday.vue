<template>
    <div class="flex w-full flex-row items-center justify-between">
        <transition name="fade">
            <div
                v-if="
                    getTeamMember(shift)?.fields?.photo?.[0]?.fields?.file?.url
                "
                class="flex w-32 items-center gap-2"
            >
                <u-avatar-group>
                    <img
                        v-if="
                            getTeamMember(shift)?.fields?.photo?.[0]?.fields
                                ?.file?.url
                        "
                        class="bg-tertiary size-8 rounded-full p-px"
                        :src="`${
                            getTeamMember(shift)?.fields?.photo?.[0]?.fields
                                ?.file?.url
                        }?w=30&h=30&fit=fill&f=face&fm=webp`"
                        :alt="getTeamMember(shift)?.fields?.name"
                    />
                    <div
                        v-else
                        class="from-tertiary-400 to-tertiary-600 size-8 rounded-full bg-gradient-to-br"
                    />
                </u-avatar-group>
                <span class="w-16 truncate">
                    {{ getTeamMember(shift)?.fields?.name }}
                </span>
            </div>
        </transition>

        <div class="w-full grow">
            <UStepper
                v-if="isTomorrow"
                v-model="active"
                :items="generateStepperShift"
                size="sm"
                color="success"
                :ui="{
                    trigger: 'size-5 m-0',
                    wrapper: 'm-0'
                }"
            />
            <UStepper
                v-else-if="!attendance?.events?.length"
                v-model="active"
                :items="generateStepperShift"
                size="sm"
                color="success"
                :ui="{
                    trigger: 'size-5 m-0',
                    wrapper: 'm-0'
                }"
            />
            <div v-else>
                {{ generateStepperEvent }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { StepperItem } from '@nuxt/ui'

const { getTeamMember } = useRotareadyUtils()
const { getTime } = useDateUtils()

interface Props {
    shift: RotareadyShift
    isTomorrow?: boolean
}

const props = defineProps<Props>()

const getShiftLength = (start: string, end: string): number => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffInMs = endDate.getTime() - startDate.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    return Math.round(diffInHours * 2) / 2 // Round to nearest half hour
}

const generateStepperShift: ComputedRef<StepperItem[]> = computed(() => {
    return [
        {
            title: getTime(props.shift.start),
            icon: 'iconamoon:enter-fill'
        },
        getShiftLength(props.shift.start, props.shift.end) > 6
            ? {
                  title: 'Suggested',
                  icon: 'solar:armchair-2-bold'
              }
            : {
                  title: 'Optional',
                  icon: 'material-symbols-light:play-arrow-outline'
              },
        {
            title: getTime(props.shift.end),
            icon: 'iconamoon:exit-fill'
        }
    ]
})

const generateStepperEvent: ComputedRef<StepperItem[]> = computed(() => {
    if (!attendance.value?.events?.length) {
        return []
    }
    return (
        attendance.value?.events?.map((event: any) => {
            const eventType = eventTypes.find(
                (et) => et.eventType === event.eventType
            )
            return {
                title: getTime(event.eventTime),
                icon: eventType
                    ? `iconamoon:${eventType.eventName
                          .toLowerCase()
                          .replace('-', '')}-fill`
                    : 'iconamoon:question-fill'
            }
        }) || []
    )
})

const { data: attendance } = await useFetch<RotareadyAttendance | null>(
    '/api/rotaready/get-event',
    {
        params: { userId: props.shift.user.id, date: '2025-10-20' }
    }
)

const active: Ref<number> = ref(attendance?.value?.events?.length ? 0 : -1)

const eventTypes = [
    {
        eventType: 1,
        eventName: 'Clock-In'
    },
    {
        eventType: 2,
        eventName: 'Clock-Out'
    },
    {
        eventType: 3,
        eventName: 'Break-On'
    },
    {
        eventType: 4,
        eventName: 'Break-Off'
    }
]

console.log('EVENT TYPES:', eventTypes)
</script>
