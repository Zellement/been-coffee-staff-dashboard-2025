<template>
    <div class="flex flex-col gap-8">
        <form class="flex w-full justify-center" @submit.prevent="handleReset">
            <div class="flex w-full flex-col gap-4">
                <u-input
                    v-model="password"
                    type="password"
                    required
                    placeholder="Enter your new password"
                    :disabled="!ready || loading"
                />
                <u-input
                    v-model="passwordagain"
                    type="password"
                    required
                    placeholder="Enter your new password again"
                    :disabled="!ready || loading"
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
            v-if="errorToShow"
            class="mt-8"
            :title="errorToShow"
            variant="solid"
            color="error"
        />
    </div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()

const props = defineProps<{
    ready: boolean
    errorMsg?: string | null
}>()
const emit = defineEmits<{ (e: 'done'): void }>()

const password = ref('')
const passwordagain = ref('')
const loading = ref(false)
const successMsg = ref('')
const localError = ref<string | null>(null)

const errorToShow = computed(() => localError.value ?? props.errorMsg ?? null)
const label = computed(() => (loading.value ? 'Saving…' : 'Update password'))
const icon = computed(() =>
    loading.value ? 'i-svg-spinners-blocks-shuffle-3' : 'i-jam-padlock-open-f'
)
const passwordsMatch = computed(() => password.value === passwordagain.value)

const handleReset = async () => {
    if (!props.ready) {
        localError.value =
            'Your reset link isn’t active. Please click the email link again.'
        return
    }
    if (!passwordsMatch.value) {
        localError.value = 'Passwords do not match'
        return
    }
    localError.value = null
    loading.value = true
    try {
        const { error } = await supabase.auth.updateUser({
            password: password.value
        })
        if (error) throw error
        successMsg.value = 'Password updated! Redirecting to login…'
        await supabase.auth.signOut()
        emit('done')
    } catch (e: any) {
        localError.value = e?.message ?? 'Failed to update password.'
    } finally {
        loading.value = false
    }
}
</script>
