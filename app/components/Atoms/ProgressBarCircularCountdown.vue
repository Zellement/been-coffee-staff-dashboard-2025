<template>
    <div class="relative">
        <svg
            class="size-full -rotate-90"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
        >
            <linearGradient id="greenGrd" x1="0%" x2="100%" y1="50%" y2="0%">
                <stop offset="0%" stop-color="#005c06" />
                <stop offset="100%" stop-color="#008a09" />
            </linearGradient>
            <!-- Background Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                :fill="progressBarClasses?.circleFill"
                :class="progressBarClasses?.unfilledBar"
            ></circle>
            <!-- Unfilled Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                class="stroke-current"
                :class="progressBarClasses?.circle"
                stroke-width="1"
            ></circle>
            <!-- Progress Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                class="stroke-current transition-all duration-1000 ease-in-out"
                :class="progressBarClasses?.filledBar"
                stroke-width="1"
                stroke-dasharray="100"
                :stroke-dashoffset="dashOffset"
                stroke-linecap="round"
            ></circle>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
            <span
                v-if="!allCompleted"
                class="flex gap-1 text-xs font-semibold"
                :class="progressBarClasses?.text"
            >
                <u-avatar-group>
                    <span :class="progressBarClasses?.textLeft">
                        {{ props.leftNumber }}
                    </span>
                    <span :class="progressBarClasses?.textRight">{{
                        props.rightNumber
                    }}</span>
                </u-avatar-group>
            </span>
            <span v-else class="m-auto flex">
                <u-icon
                    class="m-auto text-green-300"
                    size="30"
                    name="i-bx-check-circle"
                />
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    leftNumber: number
    rightNumber: number
}

const props = defineProps<Props>()

const allCompleted: ComputedRef<boolean> = computed(() => {
    return props.leftNumber === 0 && props.rightNumber === 0
})

const dashOffset: ComputedRef<number> = computed(() => {
    return allCompleted.value ? 100 : 0
})

const progressBarClasses: ComputedRef<any> = computed(() => {
    return allCompleted.value
        ? {
              circle: 'text-green-200',
              circleFill: 'url(#greenGrd)',
              filledBar: 'text-green-300',
              text: 'text-green-300',
              textLeft: 'text-green-300',
              textRight: 'text-green-300',
              unfilledBar: 'text-green-100'
          }
        : {
              circle: 'text-zinc-200',
              circleFill: 'none',
              filledBar: 'text-zinc-500',
              text: 'text-zinc-500',
              textLeft: 'bg-warning rounded-full px-2 text-white inline-block',
              textRight: 'bg-error rounded-full px-2 text-white inline-block',
              unfilledBar: 'text-zinc-100'
          }
})
</script>
