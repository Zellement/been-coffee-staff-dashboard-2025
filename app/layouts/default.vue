<template>
    <div class="layout">
        <user-profile />
        <main>
            <slot />
        </main>
        <sticky-footer />
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

userStore.setUserData()
</script>
