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
        if (!import.meta.client) {
            console.debug('[live] skip: ssr')
            return
        }
        if (!enabled.value) {
            console.debug('[live] skip: disabled')
            return
        }
        if (checking.value) {
            console.debug('[live] skip: busy')
            return
        }
        if (vis.value === 'hidden') {
            console.debug('[live] skip: hidden')
            return
        }

        checking.value = true
        try {
            const rev = await $fetch<Revision>('/api/contentful/revision', {
                query: { t: Date.now() },
                headers: { 'cache-control': 'no-cache' }
            })

            console.debug('[live] rev:', rev)
            if (!rev) {
                console.debug('[live] no rev returned')
                return
            }

            console.debug('[live] local before:', local.value)

            const keys = new Set<string>()
            ;(
                Object.keys(rev.buckets) as (keyof Revision['buckets'])[]
            ).forEach((b) => {
                const remote = rev.buckets[b] ?? 0
                const localBucket = local.value.buckets[b] ?? 0
                if (remote > localBucket) {
                    console.debug(
                        `[live] bucket "${b}" changed: ${localBucket} -> ${remote}`
                    )
                    bucketToKeys[b].forEach((k) => keys.add(k))
                }
            })

            if (keys.size) {
                const arr = Array.from(keys)
                console.debug('[live] refreshing keys:', arr)
                await refreshNuxtData(arr)
            } else {
                console.debug('[live] no refresh — buckets unchanged')
            }

            local.value = rev
            console.debug('[live] local after:', local.value)
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

            // boot once if enabled & visible
            if (enabled.value && vis.value === 'visible') {
                console.debug('[live] initial check()')
                check()
            }

            // auto pause/resume on visibility and enabled changes
            const sync = () => {
                const on = enabled.value && vis.value === 'visible'
                console.debug('[live] sync ->', {
                    enabled: enabled.value,
                    vis: vis.value,
                    running: on
                })
                return on ? resume() : pause()
            }
            watch([enabled, vis], sync, { immediate: true })

            onBeforeUnmount(() => {
                console.debug('[live] interval paused (unmount)')
                pause()
            })
        })
    }

    return { check, local }
}
