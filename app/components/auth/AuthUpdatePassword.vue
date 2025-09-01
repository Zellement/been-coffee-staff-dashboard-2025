<template>
    <div class="flex flex-col gap-8">
        <form class="flex w-full justify-center">
            <div class="flex w-full flex-col gap-4">
                <u-input
                    v-model="password"
                    type="password"
                    required
                    placeholder="Enter your new password"
                />
                <u-input
                    v-model="passwordagain"
                    type="password"
                    required
                    placeholder="Enter your new password again"
                />
                <u-button
                    :ui="{ base: 'block text-center' }"
                    :label="label"
                    :icon="icon"
                    @click="handleReset"
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

const password: Ref<string> = ref('')
const passwordagain: Ref<string> = ref('')
const loading: Ref<boolean> = ref(false)
const successMsg: Ref<string> = ref('')
const errorMsg: Ref<string> = ref('')

const label: ComputedRef<string> = computed(() =>
    loading.value ? 'Sending...' : 'Send reset link'
)

const icon: ComputedRef<string> = computed(() =>
    loading.value ? 'i-svg-spinners-blocks-shuffle-3' : 'i-jam-padlock-open-f'
)

const passwordsMatch: ComputedRef<boolean> = computed(() => {
    return password.value === passwordagain.value
})

const handleReset = async () => {
    loading.value = true
    if (!passwordsMatch.value) {
        errorMsg.value = 'Passwords do not match'
        loading.value = false
        return
    }
    errorMsg.value = ''
    try {
        const { error } = await supabase.auth.updateUser({
            password: password.value
        })
        if (error) throw error
        successMsg.value = 'Sorted!'
    } catch (error) {
        alert(error)
    }
}
</script>
