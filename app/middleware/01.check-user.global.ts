export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()

    if (user?.value?.aud === 'authenticated') return

    const PUBLIC = ['/login', '/forgot-password', '/update-password']

    if (PUBLIC.some((p) => to.path.startsWith(p))) {
        return
    }

    if (to.path === '/') {
        return navigateTo({ path: '/login' })
    }

    return navigateTo({ path: '/login', query: { url: from.path } })
})
