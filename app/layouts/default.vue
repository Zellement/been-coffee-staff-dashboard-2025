<template>
    <div class="layout">
        <user-profile />
        <main class="pb-12">
            <slot />
        </main>
        <sticky-footer />
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

userStore.setUserData()
</script>
