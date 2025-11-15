// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const PUBLIC = ['/login', '/forgot-password', '/update-password']
    if (PUBLIC.includes(to.path)) return

    const user = useSupabaseUser()

    // Wait for Supabase to restore the session from local storage/cookies
    if (!user.value) {
        const supabase = useSupabaseClient()
        const { data } = await supabase.auth.getSession()

        if (data.session) {
            // Populate composable
            user.value = data.session.user
            return
        }

        return navigateTo('/login')
    }
})
