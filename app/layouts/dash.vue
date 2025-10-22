<template>
    <div class="layout">
        <div
            class="p-default bg-seashell-50 dark:bg-primary-800 sticky top-0 z-10 flex w-full items-center justify-between gap-4"
        >
            <u-badge variant="outline">{{ formatted }}</u-badge>
            <div class="flex items-center gap-4">
                <u-button
                    label="Refresh"
                    variant="outline"
                    size="sm"
                    @click="refreshData"
                />
                <colour-mode />
            </div>
        </div>
        <daily-snapshot />
        <main class="pb-10">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'

const formatted = useDateFormat(useNow(), 'ddd DD MMM HH:mm:ss')

const userStore = useUserStore()
userStore.setUserData()

const uiStore = useUiStore()

const refreshData = async (): Promise<void> => {
    uiStore.refreshing = true
    await refreshNuxtData()
    uiStore.refreshing = false
}

const REFRESH_TIMER = 3600 // seconds
const timer: Ref<number> = ref(0)

const ACTIVE_START_MIN = 6 * 60 + 45 // 06:45
const ACTIVE_END_MIN = 19 * 60 + 30 // 19:30

const inActiveWindow = () => {
    const now = new Date()
    const mins = now.getHours() * 60 + now.getMinutes()
    return mins >= ACTIVE_START_MIN && mins < ACTIVE_END_MIN
}

// derive a reactive flag the composable can follow
const pollingEnabled = ref(inActiveWindow())

let intervalId: number | null = null
onMounted(() => {
    intervalId = window.setInterval(() => {
        const active = inActiveWindow()
        pollingEnabled.value = active // ⟵ drives composable pause/resume

        if (!active) return // freeze hourly refresh too when out of hours

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

// Now pass the enabled flag into the composable
useContentfulLiveSelective(45_000, { enabled: pollingEnabled })
</script>
