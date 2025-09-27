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

// Refresh every hour
const REFRESH_TIMER = 3600 // seconds
const timer: Ref<number> = ref(0)

// Active window: 06:30 <= now < 20:30
const ACTIVE_START_MIN = 6 * 60 + 30
const ACTIVE_END_MIN = 20 * 60 + 30

const inActiveWindow = () => {
    const now = new Date()
    const mins = now.getHours() * 60 + now.getMinutes()
    return mins >= ACTIVE_START_MIN && mins < ACTIVE_END_MIN
}

let intervalId: number | null = null

onMounted(() => {
    intervalId = window.setInterval(() => {
        if (!inActiveWindow()) {
            // freeze during 20:30–06:29 — no increments, no refresh
            return
        }

        if (timer.value >= REFRESH_TIMER) {
            refreshData()
            timer.value = 0
        } else {
            timer.value++
        }
    }, 1000)
})

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
})

useContentfulLiveSelective(10_000) // 10s (use 30s if you’re on a tunnel to avoid rate limits)
</script>
