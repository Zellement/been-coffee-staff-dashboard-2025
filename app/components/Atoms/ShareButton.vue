<template>
    <u-button
        size="xs"
        :variant="variant"
        label="Share"
        :color="color"
        :icon="icon"
        @click.prevent="shareBtn()"
    />
</template>

<script lang="ts" setup>
const uiStore = useUiStore()

const copied: Ref<boolean> = ref(false)

const currentUrl = computed(() => uiStore.currentUrl)

const shareData = computed(() => {
    return {
        url: currentUrl.value
    }
})

const color: ComputedRef<'success' | 'primary'> = computed(() => {
    return copied.value ? 'success' : 'primary'
})

const variant: ComputedRef<'solid' | 'outline'> = computed(() => {
    return copied.value ? 'solid' : 'outline'
})

const icon: ComputedRef<string> = computed(() => {
    return copied.value ? 'i-lucide-check' : 'i-lucide-share-2'
})

const shareBtn = async (): Promise<void> => {
    if (navigator.share && navigator.canShare(shareData.value)) {
        await navigator.share(shareData.value)
    } else {
        navigator.clipboard.writeText(shareData.value.url)
    }
    copied.value = true
    changeBack()
}

const changeBack = () => {
    setTimeout(() => {
        copied.value = false
    }, 3000)
}
</script>
