export default defineNuxtPlugin(() => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    supabase.auth.onAuthStateChange((_, session) => {
        user.value = session?.user ?? null
    })
})
