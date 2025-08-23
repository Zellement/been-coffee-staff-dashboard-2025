<template>
    <div class="layout">
        <user-profile />
        <location-switcher />
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

userStore.setUserData()
</script>
