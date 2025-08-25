<template>
    <nuxt-layout name="login" class="p-default flex h-dvh flex-col">
        <div class="my-auto flex flex-col">
            <div class="mb-8 flex flex-col gap-4 pt-8">
                <brand-logo class="mx-auto max-w-16" />
                <h1 class="font-riverside text-center text-xl">
                    <span class="hidden">Been Coffee</span>Dashboard
                </h1>
            </div>
            <auth-login class="mx-auto w-full max-w-60" />
            <nuxt-link
                to="/forgot-password"
                class="mt-16 block text-center text-xs"
            >
                Forgot your password?
            </nuxt-link>
        </div>
    </nuxt-layout>
</template>

<script setup>
useHead({
    title: 'Login to the Been Staff Dashboard'
})

definePageMeta({
    layout: false
})
</script>
