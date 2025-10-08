import { useIntervalFn, useDocumentVisibility } from '@vueuse/core'

type Revision = {
    global: number
    buckets: {
        noticeBoard: number
        taskInstances: number
        beenAwesomeWinners: number
        tableBookings: number
        dailyTasks: number
        routineTasks: number
        orders: number
        assets: number
    }
}
const DEFAULT_LOCAL: Revision = {
    global: 0,
    buckets: {
        noticeBoard: 0,
        taskInstances: 0,
        beenAwesomeWinners: 0,
        dailyTasks: 0,
        routineTasks: 0,
        tableBookings: 0,
        orders: 0,
        assets: 0
    }
}
// composables/useContentfulLiveSelective.ts
export function useContentfulLiveSelective(
    intervalMs = 60_000,
    opts: { enabled?: Ref<boolean> | ComputedRef<boolean> } = {}
) {
    const vis = useDocumentVisibility()
    const enabled = opts.enabled ?? ref(true)

    const local = useState<Revision>('contentful:localRevs', () =>
        structuredClone(DEFAULT_LOCAL)
    )
    const checking = ref(false)

    const bucketToKeys: Record<keyof Revision['buckets'], string[]> = {
        noticeBoard: ['noticeBoard'],
        dailyTasks: ['dailyTasks'],
        routineTasks: ['routineTasks'],
        taskInstances: ['dailyTasks', 'routineTasks'],
        beenAwesomeWinners: ['beenAwesomeWinners'],
        tableBookings: ['tableBookings'],
        orders: ['orders'],
        assets: [
            'noticeBoard',
            'dailyTasks',
            'routineTasks',
            'beenAwesomeWinners',
            'tableBookings',
            'orders'
        ]
    }

    const check = async () => {
        if (!import.meta.client) return
        if (!enabled.value) return // ⟵ respect enabled flag
        if (checking.value) return
        if (vis.value === 'hidden') return

        checking.value = true
        try {
            const rev = await $fetch<Revision>('/api/contentful/revision', {
                query: { t: Date.now() },
                headers: { 'cache-control': 'no-cache' }
            })
            if (!rev) return
            const keys = new Set<string>()
            ;(
                Object.keys(rev.buckets) as (keyof Revision['buckets'])[]
            ).forEach((b) => {
                if ((rev.buckets[b] ?? 0) > (local.value.buckets[b] ?? 0)) {
                    bucketToKeys[b].forEach((k) => keys.add(k))
                }
            })
            if (keys.size) await refreshNuxtData(Array.from(keys))
            local.value = rev
        } catch {
            // ignore (e.g., 401 when logged out)
        } finally {
            checking.value = false
        }
    }

    if (import.meta.client) {
        onMounted(() => {
            // create a controllable interval we can pause/resume
            const { pause, resume } = useIntervalFn(check, intervalMs)

            // boot once if enabled & visible
            if (enabled.value && vis.value === 'visible') check()

            // auto pause/resume on visibility and enabled changes
            const sync = () =>
                enabled.value && vis.value === 'visible' ? resume() : pause()
            watch([enabled, vis], sync, { immediate: true })

            onBeforeUnmount(pause)
        })
    }

    return { check, local }
}
