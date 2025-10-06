<template>
    <div class="flex flex-col gap-8">
        <form class="flex w-full justify-center" @submit.prevent="handleReset">
            <div class="flex w-full flex-col gap-4">
                <u-input
                    v-model="password"
                    type="password"
                    required
                    placeholder="Enter your new password"
                    :disabled="!ready"
                />
                <u-input
                    v-model="passwordagain"
                    type="password"
                    required
                    placeholder="Enter your new password again"
                    :disabled="!ready"
                />
                <u-button
                    :ui="{ base: 'block text-center' }"
                    :label="ready ? label : 'Validating link…'"
                    :icon="ready ? icon : 'i-svg-spinners-blocks-shuffle-3'"
                    type="submit"
                    :disabled="!ready || loading"
                />
            </div>
        </form>

        <u-alert
            v-if="successMsg"
            class="mt-8"
            :title="successMsg"
            variant="solid"
            color="neutral"
        />
        <u-alert
            v-if="errorMsg"
            class="mt-8"
            :title="errorMsg"
            variant="solid"
            color="error"
        />
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const supabase = useSupabaseClient()
const route = useRoute()
const router = useRouter()

const password = ref('')
const passwordagain = ref('')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const ready = ref(false)

const label = computed(() => (loading.value ? 'Saving…' : 'Update password'))
const icon = computed(() =>
    loading.value ? 'i-svg-spinners-blocks-shuffle-3' : 'i-jam-padlock-open-f'
)
const passwordsMatch = computed(() => password.value === passwordagain.value)

onMounted(async () => {
    try {
        // v2 PKCE recovery: ?type=recovery&code=...
        if (route.query.type === 'recovery' && route.query.code) {
            const code = String(route.query.code)
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (error) throw error
            // Optional: strip query so refresh doesn't retry exchange
            await router.replace({ path: '/update-password' })
        }

        // Verify we actually have a session before enabling the form
        const {
            data: { session }
        } = await supabase.auth.getSession()
        if (!session) {
            throw new Error(
                'Session not found. Please open the password reset link from your email again.'
            )
        }

        ready.value = true
    } catch (e: any) {
        errorMsg.value =
            e?.message ?? 'Could not validate the password reset link.'
        ready.value = false
    }
})

const handleReset = async () => {
    if (!ready.value) {
        errorMsg.value =
            'Your reset link isn’t active. Please click the email link again.'
        return
    }
    if (!passwordsMatch.value) {
        errorMsg.value = 'Passwords do not match'
        return
    }
    errorMsg.value = ''
    loading.value = true
    try {
        const { error } = await supabase.auth.updateUser({
            password: password.value
        })
        if (error) throw error
        successMsg.value = 'Password updated! You can now log in.'
        await supabase.auth.signOut()
        await navigateTo('/login?passwordReset=1', { replace: true })
    } catch (e: any) {
        errorMsg.value = e?.message ?? 'Failed to update password.'
    } finally {
        loading.value = false
    }
}
</script>
