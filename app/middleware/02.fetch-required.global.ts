// middleware/init-locations.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
    // Skip on auth pages if you want
    if (
        [
            '/login',
            '/register',
            '/confirm',
            '/forgot-password',
            '/update-password'
        ].includes(to.path)
    )
        return

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const locationsStore = useLocationsStore()
    const uiStore = useUiStore()

    // Ensure Supabase session is hydrated on the client before doing anything
    if (import.meta.client) {
        await supabase.auth.getSession() // resolves once cookies/session are ready
    }

    // Not logged in? Don't call protected APIs.
    if (!user.value || user.value.aud !== 'authenticated') return

    // Already have locations? Done.
    if (locationsStore.allLocations?.length) {
        uiStore.siteIsLoading = false
        return
    }

    // Fetch once (handles 401 gracefully just in case)
    try {
        const locationData = await $fetch('/api/contentful/fetch-entries', {
            params: { content_type: 'location', include: 2 },
            headers: { 'cache-control': 'no-cache' }
        })
        locationsStore.allLocations = locationData.items
        locationsStore.totalLocations = locationData.total
    } catch (e: any) {
        if (e?.status === 401) return // session edge-case; avoid crashing navigation
        throw e
    }

    const operationsStore = useOperationsStore()
    if (operationsStore.operationsData) {
        uiStore.siteIsLoading = false
        return
    }
    // Fetch once (handles 401 gracefully just in case)
    try {
        const operationsData = await $fetch('/api/contentful/fetch-entries', {
            params: { content_type: 'operations', include: 2 },
            headers: { 'cache-control': 'no-cache' }
        })
        operationsStore.operationsData = operationsData.items[0]
    } catch (e: any) {
        if (e?.status === 401) return // session edge-case; avoid crashing navigation
        throw e
    }

    uiStore.siteIsLoading = false
})
