<template>
    <h2 class="mb-16 text-center font-riverside-outline text-2xl">
        Update your password
    </h2>

    <auth-update-password class="mx-auto w-full max-w-60" />

    <nuxt-link to="/login" class="mt-16 block text-center text-xs">
        Back to login
    </nuxt-link>
</template>

<script setup>
definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Update your password | Been Coffee Staff Dashboard'
})
</script>
