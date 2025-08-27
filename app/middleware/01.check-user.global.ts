import { useUiStore } from '@/stores/ui'

export default defineNuxtRouteMiddleware((to, from) => {
    const uiStore = useUiStore()
    const config = useRuntimeConfig()

    uiStore.currentUrl = `${config.public.SITE_URL}${to.path}`

    const user = useSupabaseUser()

    if (user?.value?.aud === 'authenticated') {
        return
    }

    if (
        to.path === '/login' ||
        to.path === '/forgot-password' ||
        to.path === '/update-password' ||
        to.fullPath === '/locations/willington'
    )
        return

    // Prevent adding QS to index
    if (to.path === '/') {
        return navigateTo({
            path: '/login'
        })
    }

    // Add QS from originating URL to forward on to
    return navigateTo({
        path: '/login',
        query: {
            url: from.path
        }
    })
})
