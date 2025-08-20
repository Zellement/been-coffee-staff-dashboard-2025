<template>
    <u-app>
        <nuxt-layout>
            <nuxt-page />
        </nuxt-layout>
    </u-app>
</template>

<script setup lang="ts">
const uiStore = useUiStore()

/* --------------------------
// Computed
-------------------------- */

const isAnyModalActive: ComputedRef<boolean> = computed(() => {
    return uiStore.showMobileNav
})

/* --------------------------
// Hooks and composables
-------------------------- */

useHead({
    // Prevent page scrolling when mobile nav is open
    bodyAttrs: {
        class: computed((): string => {
            if (isAnyModalActive.value) return 'overflow-hidden'
            return ''
        })
    }
})
</script>
