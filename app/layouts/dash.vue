<template>
    <div class="layout">
        <div
            class="p-default bg-seashell-50 dark:bg-primary-800 sticky top-0 z-10 flex w-full items-center justify-end gap-4"
        >
            <u-button
                label="Refresh"
                variant="outline"
                size="sm"
                @click="refreshData"
            />
            <colour-mode />
        </div>
        <daily-snapshot />
        <main class="pb-10">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

userStore.setUserData()

const uiStore = useUiStore()
const refreshData = async () => {
    uiStore.refreshing = true
    await refreshNuxtData()
    uiStore.refreshing = false
}

useContentfulLiveSelective(10_000) // 10s (use 30s if you’re on a tunnel to avoid rate limits)
</script>
