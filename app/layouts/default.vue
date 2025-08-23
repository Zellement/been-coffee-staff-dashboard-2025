<template>
    <div class="layout">
        <user-profile />
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

userStore.setUserData()
</script>
