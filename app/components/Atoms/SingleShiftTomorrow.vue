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
                v-model="active"
                :items="generateStepperShift"
                size="sm"
                color="success"
                :ui="{
                    trigger: 'size-5 m-0',
                    wrapper: 'm-0'
                }"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { StepperItem } from '@nuxt/ui'

const { getTeamMember } = useRotareadyUtils()
const { getTime } = useDateUtils()

interface Props {
    shift: RotareadyShift
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

const active: Ref<number> = ref(-1)
</script>
