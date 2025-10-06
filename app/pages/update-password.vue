<template>
    <h2 class="font-riverside-outline mb-16 text-center text-2xl">
        Update your password
    </h2>

    <auth-update-password
        class="mx-auto w-full max-w-60"
        :ready="ready"
        :error-msg="pageError"
        @done="() => navigateTo('/login?passwordReset=1', { replace: true })"
    />

    <nuxt-link to="/login" class="mt-16 block text-center text-xs">
        Back to login
    </nuxt-link>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const route = useRoute()
const router = useRouter()

definePageMeta({ layout: 'auth' })
useHead({ title: 'Update your password | Been Coffee Staff Dashboard' })

const ready = ref(false)
const pageError = ref<string | null>(null)

onMounted(async () => {
    try {
        console.log('[UPDATE-PASSWORD] mounted', route.fullPath, route.query)

        // v2 PKCE recovery
        if (
            route.query.type === 'recovery' &&
            typeof route.query.code === 'string'
        ) {
            console.log('[UPDATE-PASSWORD] exchanging code...')
            const { error } = await supabase.auth.exchangeCodeForSession(
                String(route.query.code)
            )
            if (error) throw error
            // strip query so refresh doesn't retry exchange
            await router.replace({ path: '/update-password' })
        }

        // verify we actually have a session before enabling the form
        const {
            data: { session }
        } = await supabase.auth.getSession()
        if (!session)
            throw new Error(
                'Session not found. Please open the password reset link from your email again.'
            )
        ready.value = true
        console.log('[UPDATE-PASSWORD] session established')
    } catch (e: any) {
        console.error('[UPDATE-PASSWORD] error:', e?.message)
        pageError.value =
            e?.message ?? 'Could not validate the password reset link.'
        ready.value = false
    }
})
</script>
