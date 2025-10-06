export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    console.log('[MIDDLEWARE]', to.path, 'user:', user.value?.aud)

    if (user?.value?.aud === 'authenticated') return

    if (
        to.path === '/login' ||
        to.path === '/forgot-password' ||
        to.path === '/update-password'
    ) {
        console.log('[MIDDLEWARE] allowed public route:', to.path)
        return
    }

    if (to.path === '/') {
        console.log('[MIDDLEWARE] redirecting from index')
        return navigateTo({ path: '/login' })
    }

    console.log('[MIDDLEWARE] redirecting to login from', to.path)
    return navigateTo({ path: '/login', query: { url: from.path } })
})
