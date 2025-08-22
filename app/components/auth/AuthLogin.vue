<template>
    <form class="flex w-full justify-center" @submit.prevent="handleLogin">
        <div class="flex w-full flex-col gap-4">
            <input
                v-model="email"
                class="dark:bg-navy-700 p-2"
                type="email"
                placeholder="Your email"
            />
            <input
                v-model="password"
                class="dark:bg-navy-700 p-2"
                type="password"
                placeholder="Your password"
            />
            <input
                type="submit"
                class="button cursor-pointer self-end"
                :value="loading ? 'Bear with...' : 'Login'"
                :disabled="loading"
            />
        </div>
    </form>
    <div v-if="errorMsg" class="text-red-500">
        {{ errorMsg }}
    </div>
</template>

<script setup>
const client = useSupabaseClient()

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const email = ref('')
const password = ref('')

const errorMsg = ref(null)

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
        errorMsg.value = error.message
    } finally {
        loading.value = false
    }
}
</script>
