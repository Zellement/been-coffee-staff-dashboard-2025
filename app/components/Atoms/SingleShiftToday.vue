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
                v-if="!attendance?.events?.length"
                v-model="active"
                :items="generateStepper(shift)"
                size="sm"
                color="success"
                :ui="{
                    trigger: 'size-5 m-0',
                    wrapper: 'm-0'
                }"
            />
            <UStepper
                v-else
                v-model="active"
                :items="generateStepper(shift)"
                size="sm"
                color="success"
                :ui="{
                    trigger: 'size-5 m-0',
                    wrapper: 'm-0'
                }"
            />
            <!-- 
            <pre>
            {{ attendance }}
            </pre> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
const { getTeamMember, generateStepper } = useRotareadyUtils()

interface Props {
    shift: RotareadyShift
}

const props = defineProps<Props>()

const { data: attendance } = await useFetch<RotareadyAttendance | null>(
    '/api/rotaready/get-event',
    {
        params: { userId: props.shift.user.id, date: '2025-10-20' }
    }
)

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

const clockedInAt: ComputedRef<string | undefined> = computed(() => {
    return attendance?.value?.events.find((event) => event.eventType === 1)
        ?.date
})

const clockedOutAt: ComputedRef<string | undefined> = computed(() => {
    return attendance?.value?.events.find((event) => event.eventType === 2)
        ?.date
})

const breakInAt: ComputedRef<string | undefined> = computed(() => {
    return attendance?.value?.events.find((event) => event.eventType === 3)
        ?.date
})

const breakOffAt: ComputedRef<string | undefined> = computed(() => {
    return attendance?.value?.events.find((event) => event.eventType === 4)
        ?.date
})

const active: ComputedRef<number> = computed(() => {
    if (clockedOutAt.value) {
        return 3
    } else if (breakOffAt.value) {
        return 2
    } else if (breakInAt.value) {
        return 1
    } else if (clockedInAt.value) {
        return 0
    } else {
        return -1
    }
})

console.log('EVENT TYPES:', eventTypes)
</script>
