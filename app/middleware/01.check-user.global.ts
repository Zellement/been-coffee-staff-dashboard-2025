export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    console.log('[MIDDLEWARE]', to.path, 'user:', user.value?.aud)

    if (user?.value?.aud === 'authenticated') return

    const PUBLIC = ['/login', '/forgot-password', '/update-password']

    if (PUBLIC.some((p) => to.path.startsWith(p))) {
        console.log('[MIDDLEWARE] allowed public route:', to.fullPath)
        return
    }

    if (to.path === '/') {
        console.log('[MIDDLEWARE] redirecting from index')
        return navigateTo({ path: '/login' })
    }

    console.log('[MIDDLEWARE] redirecting to login from', to.path)
    return navigateTo({ path: '/login', query: { url: from.path } })
})
