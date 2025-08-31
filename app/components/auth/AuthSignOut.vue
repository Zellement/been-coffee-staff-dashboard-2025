<template>
    <u-button
        class="flex flex-row items-center gap-1 p-2"
        color="primary"
        variant="solid"
        @click="handleSignOut"
    >
        <Icon
            name="clarity:sign-out-line"
            class="dark:hover:text-butterscotch-500 flex h-6 w-6 cursor-pointer transition-all duration-300 hover:text-white"
        />
        <span>Sign out</span>
    </u-button>
</template>

<script setup>
const client = useSupabaseClient()

const handleSignOut = async () => {
    try {
        const { error } = await client.auth.signOut()
        if (error) throw error
        navigateTo('/login')
    } catch (error) {
        console.log(error.message)
    }
}
</script>
