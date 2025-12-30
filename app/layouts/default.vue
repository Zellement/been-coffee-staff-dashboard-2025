<template>
    <div class="layout">
        <transition name="fade" mode="out-in">
            <div
                v-if="uiStore.siteIsLoading"
                key="siteIsLoading"
                class="fixed inset-0 z-9999 flex bg-white/90 backdrop-blur dark:bg-navy-500/90"
            >
                <div class="m-auto flex flex-col items-center">
                    <u-icon name="i-svg-spinners-blocks-shuffle-3" />
                    <p>Loading...</p>
                </div>
            </div>
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
