<template>
    <div class="flex flex-col gap-8">
        <form class="flex w-full justify-center" @submit.prevent="handleReset">
            <div class="flex w-full flex-col gap-4">
                <u-input
                    v-model="email"
                    type="email"
                    placeholder="Enter your email address"
                />
                <u-button
                    variant="solid"
                    color="tertiary"
                    :ui="{ base: 'block text-center' }"
                    :label="label"
                    :icon="icon"
                    type="submit"
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
const supabase = useSupabaseClient()

const config = useRuntimeConfig()

const loading: Ref<boolean> = ref(false)
const email: Ref<string> = ref('')

const label: ComputedRef<string> = computed(() =>
    loading.value ? 'Sending...' : 'Send reset link'
)

const icon: ComputedRef<string> = computed(() =>
    loading.value ? 'i-svg-spinners-blocks-shuffle-3' : 'i-jam-padlock-open-f'
)

const successMsg: Ref<string | null> = ref(null)
const errorMsg: Ref<string | null> = ref(null)

const handleReset = async () => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(
            email.value,
            {
                redirectTo: `${config.public.WEBSITE_URL}/update-password`
            }
        )
        if (error) throw error
        successMsg.value =
            'If this email exists, we will send you a password reset link. Check your inbox AND your junk/spam folders. Redirecting to login...'
        setTimeout(async () => {
            await navigateTo('/login')
        }, 2000)
    } catch (error) {
        console.log(error)
        errorMsg.value = (error as { message: string }).message
    }
}
</script>
