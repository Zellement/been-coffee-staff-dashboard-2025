<template>
    <div class="mb-2 flex items-end justify-between">
        <h2 class="uc-text uc-text--carousel-title">
            {{ title }}
        </h2>
        <slot />
    </div>
</template>

<script lang="ts" setup>
interface Props {
    title: string
}

defineProps<Props>()
</script>
