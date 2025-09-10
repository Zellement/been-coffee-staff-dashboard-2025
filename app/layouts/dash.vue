<template>
    <div class="layout">
        <div
            class="p-default bg-seashell-50 dark:bg-primary-800 sticky top-0 z-10 flex w-full items-center justify-end gap-4"
        >
            <u-progress v-model="timer" class="max-w-80" :max="REFRESH_TIMER" />
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

const REFRESH_TIMER = 600 // seconds

const uiStore = useUiStore()
const refreshData = async () => {
    uiStore.refreshing = true
    await refreshNuxtData()
    uiStore.refreshing = false
}

const timer: Ref<number> = ref(0)
onMounted(() => {
    setInterval(() => {
        if (timer.value >= REFRESH_TIMER) {
            refreshData()
            timer.value = 0
        } else {
            timer.value++
        }
    }, 1000) // 1 second
})
</script>
