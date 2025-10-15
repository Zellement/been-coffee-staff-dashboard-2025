import { useIntervalFn } from '@vueuse/core'

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

export function useContentfulLiveSelective(
    intervalMs = 60_000,
    opts: { enabled?: Ref<boolean> | ComputedRef<boolean> } = {}
) {
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
        if (!enabled.value) return
        if (checking.value) return

        checking.value = true
        try {
            const rev = await $fetch<Revision>('/api/contentful/revision', {
                query: { t: Date.now() },
                headers: { 'cache-control': 'no-cache' }
            })

            if (!rev) {
                console.debug('[live] no rev returned')
                return
            }

            const keys = new Set<string>()
            ;(
                Object.keys(rev.buckets) as (keyof Revision['buckets'])[]
            ).forEach((b) => {
                const remote = rev.buckets[b] ?? 0
                const localBucket = local.value.buckets[b] ?? 0
                if (remote > localBucket) {
                    bucketToKeys[b].forEach((k) => keys.add(k))
                }
            })

            if (keys.size) {
                const arr = Array.from(keys)
                // console.debug('[live] refreshing keys:', arr)
                await refreshNuxtData(arr)
            } else {
                // console.debug('[live] no refresh — buckets unchanged')
            }

            local.value = rev
        } catch (e) {
            console.warn('[live] revision fetch failed', e)
        } finally {
            checking.value = false
        }
    }

    if (import.meta.client) {
        onMounted(() => {
            const { pause, resume } = useIntervalFn(check, intervalMs)
            console.debug('[live] interval started @', intervalMs, 'ms')

            // kick once if enabled
            if (enabled.value) {
                // console.debug('[live] initial check()')
                check()
            }

            // pause/resume based ONLY on `enabled`
            const sync = () => (enabled.value ? resume() : pause())
            watch(enabled, sync, { immediate: true })

            onBeforeUnmount(() => {
                console.debug('[live] interval paused (unmount)')
                pause()
            })
        })
    }

    return { check, local }
}
