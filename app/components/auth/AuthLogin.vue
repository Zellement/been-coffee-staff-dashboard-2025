<template>
    <div class="">
        <form class="flex w-full justify-center" @submit.prevent="handleLogin">
            <div class="flex w-full flex-col gap-4">
                <u-input v-model="email" type="email" />
                <u-input v-model="password" type="password" />
                <u-button
                    :ui="{ base: 'block text-center' }"
                    :label="label"
                    :icon="icon"
                    @click="handleLogin"
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
const client = useSupabaseClient()

const router = useRouter()
const route = useRoute()

const loading: Ref<boolean> = ref(false)
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')

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
        const { error } = await client.auth.signInWithPassword({
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
