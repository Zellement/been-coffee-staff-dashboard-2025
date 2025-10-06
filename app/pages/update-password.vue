<template>
    <h2 class="font-riverside-outline mb-16 text-center text-2xl">
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

const supabase = useSupabaseClient()
const route = useRoute()

onMounted(async () => {
    console.log('[UPDATE-PASSWORD] mounted', route.query)

    if (route.query.type === 'recovery' && route.query.code) {
        console.log('[UPDATE-PASSWORD] exchanging code...')
        const { data, error } = await supabase.auth.exchangeCodeForSession(
            String(route.query.code)
        )
        if (error) {
            console.error('[UPDATE-PASSWORD] exchange error:', error.message)
        } else {
            console.log('[UPDATE-PASSWORD] session established', data)
        }
    }
})
</script>
