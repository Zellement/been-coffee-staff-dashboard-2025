<template>
    <u-button
        class="flex flex-row items-center gap-1 p-2"
        label="Sign out"
        color="tertiary"
        variant="outline"
        icon="clarity:sign-out-line"
        @click="handleSignOut"
    />
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
