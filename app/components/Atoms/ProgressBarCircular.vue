<template>
    <div class="relative">
        <svg
            class="size-full -rotate-90"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
        >
            <!-- Background Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="currentColor"
                class="text-butterscotch-100"
                :class="allCompleted?.green300"
            ></circle>
            <!-- Unfilled Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                class="stroke-current text-gray-500"
                stroke-width="2"
            ></circle>
            <!-- Progress Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                class="text-butterscotch-500 stroke-current transition-all"
                :class="allCompleted?.green500"
                stroke-width="2"
                stroke-dasharray="100"
                :stroke-dashoffset="dashOffset"
                stroke-linecap="round"
            ></circle>
        </svg>
        <div
            class="absolute inset-0 flex items-center justify-center"
            :class="allCompleted?.green500"
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

const allCompleted: ComputedRef<any> = computed(() => {
    return props.completedItems === props.totalItems
        ? {
              green500: 'text-green-500',
              green300: 'text-green-200'
          }
        : null
})
</script>
