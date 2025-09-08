<template>
    <h2 class="font-riverside-outline mb-16 text-center text-2xl">Login</h2>
    <div class="flex flex-col">
        <auth-login class="mx-auto w-full max-w-60" />
        <nuxt-link
            to="/forgot-password"
            class="mt-16 block text-center text-xs"
        >
            Forgot your password?
        </nuxt-link>
    </div>
</template>

<script setup>
useHead({
    title: 'Login | Been Coffee Staff Dashboard'
})

definePageMeta({
    layout: 'auth'
})
</script>
