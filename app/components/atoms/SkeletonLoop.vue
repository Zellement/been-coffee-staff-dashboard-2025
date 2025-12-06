<template>
    <div class="flex w-full gap-4 overflow-hidden">
        <u-skeleton
            v-for="i in count"
            :key="i"
            class="shrink-0"
            :class="skeletonClass"
        />
    </div>
</template>

<script lang="ts" setup>
interface Props {
    count?: number
    skeletonClass?: string
}

withDefaults(defineProps<Props>(), {
    count: 6,
    skeletonClass: 'h-17 basis-48'
})
</script>
