<template>
    <div class="flex w-full flex-row items-center justify-between">
        <div class="w-auto min-w-16 truncate">{{ shift.user?.firstName }}</div>
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
    }
}

const props = defineProps<Props>()

const getTime = (dateString: string): string => {
    return useDateFormat(dateString, 'HH:mm', { locales: 'en-GB' }).value
}

const active: Ref<number> = ref(-1)

const generateStepper: ComputedRef<StepperItem[]> = computed(() => {
    return [
        {
            title: getTime(props.shift.start),
            icon: 'iconamoon:enter-fill'
        },
        {
            title: 'Break',
            icon: 'solar:armchair-2-bold'
        },
        {
            title: getTime(props.shift.end),
            icon: 'iconamoon:exit-fill'
        }
    ]
})
</script>
