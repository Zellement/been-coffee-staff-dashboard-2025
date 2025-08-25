<template>
    <div class="">
        <form class="flex w-full justify-center" @submit.prevent="handleLogin">
            <div class="flex w-full flex-col gap-4">
                <u-input v-model="email" placeholder="Email" type="email" />
                <u-input
                    v-model="password"
                    placeholder="Password"
                    :type="showPassword ? 'text' : 'password'"
                >
                    <template #trailing>
                        <UButton
                            color="neutral"
                            variant="link"
                            size="sm"
                            :icon="
                                showPassword
                                    ? 'i-lucide-eye-off'
                                    : 'i-lucide-eye'
                            "
                            :aria-label="
                                showPassword ? 'Hide password' : 'Show password'
                            "
                            :aria-pressed="showPassword"
                            aria-controls="password"
                            @click="showPassword = !showPassword"
                        />
                    </template>
                </u-input>
                <u-button
                    :ui="{ base: 'block text-center' }"
                    :label="label"
                    :icon="icon"
                />
            </div>
        </form>
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

const router = useRouter()
const route = useRoute()

const loading: Ref<boolean> = ref(false)
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const showPassword: Ref<boolean> = ref(false)

const label: ComputedRef<string> = computed(() =>
    loading.value ? 'Logging in...' : 'Login'
)

const icon: ComputedRef<string> = computed(() =>
    loading.value ? 'i-svg-spinners-blocks-shuffle-3' : 'i-uil-padlock'
)

const errorMsg: Ref<string | null> = ref(null)

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        if (error) throw error
        router.push(`${route.query?.url ?? '/'}`)
    } catch (error) {
        errorMsg.value = (error as { message: string }).message
    } finally {
        loading.value = false
    }
}
</script>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
    display: none;
}
</style>
