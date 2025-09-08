<template>
    <div class="layout">
        <main class="pb-24">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

userStore.setUserData()
</script>
