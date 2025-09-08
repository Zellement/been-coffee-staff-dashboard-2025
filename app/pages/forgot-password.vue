<template>
    <h2 class="font-riverside-outline mb-16 text-center text-2xl">
        Reset your password
    </h2>

    <auth-reset-password class="mx-auto w-full max-w-60" />

    <nuxt-link to="/login" class="mt-16 block text-center text-xs">
        Back to login
    </nuxt-link>
</template>

<script setup>
useHead({
    title: 'Reset your password. | Been Coffee Staff Dashboard'
})

definePageMeta({
    layout: 'auth'
})
</script>
