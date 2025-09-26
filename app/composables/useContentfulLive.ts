// composables/useContentfulLive.ts
import { useIntervalFn, useDocumentVisibility } from '@vueuse/core'

export function useContentfulLive(intervalMs = 10_000) {
    const localRev = useState<number>('contentful:localRev', () => 0)
    const checking = ref(false)
    const lastCheckAt = ref<string | null>(null)
    const vis = useDocumentVisibility()

    const check = async () => {
        if (!import.meta.client) return
        if (checking.value) return
        // Optional: pause polling when tab not visible
        if (vis.value === 'hidden') return

        console.log('checking...')
        checking.value = true
        try {
            // ✅ use $fetch for client-side polling
            const data = await $fetch<{ rev?: number }>(
                '/api/contentful/revision',
                {
                    query: { t: Date.now() },
                    headers: { 'cache-control': 'no-cache' }
                }
            )

            const serverRev = Number(data?.rev ?? 0)
            if (serverRev > localRev.value) {
                console.log('refreshing...')
                await refreshNuxtData() // or refreshNuxtData(['locations','reviews',...])
                localRev.value = serverRev
            }
        } catch (e: any) {
            // If route is Supabase-protected and user is logged out, you'll get 401 here.
            // You can optionally redirect to /login, or just noop.
            if (e?.status === 401) {
                // optional: navigateTo('/login')
            }
        } finally {
            checking.value = false
            lastCheckAt.value = new Date().toISOString()
        }
    }

    if (process.client) {
        onMounted(() => {
            check() // run once immediately
            const { pause } = useIntervalFn(check, intervalMs)
            onBeforeUnmount(pause)
        })
    }

    return { check, localRev, lastCheckAt }
}
