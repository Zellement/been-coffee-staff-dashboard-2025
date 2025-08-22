<template>
    <div>
        <nuxt-layout name="login">
            <div class="mb-8 flex flex-col gap-4">
                <h1 class="h1">Been Coffee Dashboard</h1>
                <h2 class="h2">Login</h2>
            </div>
            <auth-login />
            <nuxt-link
                to="/forgot-password"
                class="mt-4 block text-right text-xs"
            >
                Forgot your password?
            </nuxt-link>
        </nuxt-layout>
    </div>
</template>

<script setup>
useHead({
    title: 'Login to the Been Staff Dashboard'
})

definePageMeta({
    layout: false
})
</script>
