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
        <div
            class="absolute inset-0 flex items-center justify-center"
            :class="progressBarClasses?.text"
        >
            <span class="text-base font-semibold">
                {{ props.completedItems }} / {{ props.totalItems }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    totalItems: number
    completedItems: number
}

const props = defineProps<Props>()

const dashOffset: ComputedRef<number> = computed(() => {
    const percentage = (props.completedItems / props.totalItems) * 100
    return 100 - percentage
})

const progressBarClasses: ComputedRef<any> = computed(() => {
    return props.completedItems === props.totalItems
        ? {
              circle: 'text-green-200',
              circleFill: 'url(#greenGrd)',
              filledBar: 'text-green-300',
              text: 'text-green-300',
              unfilledBar: 'text-green-100'
          }
        : {
              circle: 'text-butterscotch-200 dark:text-butterscotch-900',
              circleFill: 'none',
              filledBar: 'dark:text-butterscotch-500 text-tuscany-500',
              text: 'text-butterscotch-500',
              unfilledBar: 'text-butterscotch-100'
          }
})
</script>
