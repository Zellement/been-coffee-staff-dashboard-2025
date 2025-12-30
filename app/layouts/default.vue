<template>
    <div class="layout">
        <transition name="fade" mode="out-in">
            <loading-overlay v-if="uiStore.siteIsLoading" class="z-9999" />
        </transition>
        <user-profile />
        <main class="pb-24">
            <slot />
        </main>
        <sticky-footer />
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

userStore.setUserData()
const uiStore = useUiStore()
</script>
