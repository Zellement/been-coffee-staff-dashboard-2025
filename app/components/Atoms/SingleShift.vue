<template>
    <div class="flex w-full flex-row items-center justify-between">
        <transition name="fade">
            <div
                v-if="
                    getTeamMember(shift)?.fields?.photo?.[0]?.fields?.file?.url
                "
                class="flex w-32 items-center gap-2"
            >
                <img
                    class="rounded-full"
                    :src="`${
                        getTeamMember(shift)?.fields?.photo?.[0]?.fields?.file
                            ?.url
                    }?w=30&h=30&fit=fill&f=face&fm=webp`"
                    :alt="getTeamMember(shift)?.fields?.name"
                />
                <span class="w-12 truncate">{{
                    getTeamMember(shift)?.fields?.name
                }}</span>
            </div>
        </transition>
        <div class="w-full grow">
            <UStepper
                v-model="active"
                :items="generateStepper"
                size="sm"
                color="success"
                :ui="{
                    trigger: 'size-5 translate-y-2'
                }"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { StepperItem } from '@nuxt/ui'
import { useDateFormat } from '@vueuse/core'

interface Props {
    shift: ShiftItem
}

interface ShiftItem {
    id: string | number
    userName?: string
    start: string
    end: string
    user?: {
        firstName: string
        lastName: string
        id: string | number
    }
}

const locationsStore = useLocationsStore()

const allTeam: ComputedRef<TypeEmployee[]> = computed(() => {
    return locationsStore.getAllTeamMembers || []
})

const getTeamMember = (shift: ShiftItem) => {
    return allTeam.value.find(
        (member) => member.fields.rotareadyId === shift.user?.id
    )
}

const props = defineProps<Props>()

const getTime = (dateString: string): string => {
    return useDateFormat(dateString, 'HH:mm', { locales: 'en-GB' }).value
}

const active: Ref<number> = ref(-1)

const getShiftLength = (start: string, end: string): number => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffInMs = endDate.getTime() - startDate.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    return Math.round(diffInHours * 2) / 2 // Round to nearest half hour
}

const generateStepper: ComputedRef<StepperItem[]> = computed(() => {
    return [
        {
            title: getTime(props.shift.start),
            icon: 'iconamoon:enter-fill'
        },
        getShiftLength(props.shift.start, props.shift.end) > 6
            ? {
                  title: 'Break',
                  icon: 'solar:armchair-2-bold'
              }
            : {
                  title: '',
                  icon: '-'
              },
        {
            title: getTime(props.shift.end),
            icon: 'iconamoon:exit-fill'
        }
    ]
})
</script>
