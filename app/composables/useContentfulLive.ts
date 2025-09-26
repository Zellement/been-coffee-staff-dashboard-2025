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

export function useContentfulLiveSelective(intervalMs = 10_000) {
    const vis = useDocumentVisibility()
    const local = useState<Revision>('contentful:localRevs', () =>
        structuredClone(DEFAULT_LOCAL)
    )
    const checking = ref(false)

    // Map buckets -> your useFetch asyncData keys
    // composables/useContentfulLiveSelective.ts
    const bucketToKeys: Record<keyof Revision['buckets'], string[]> = {
        noticeBoard: ['noticeBoard'],
        // when the Task model changes, re-fetch the corresponding instances
        dailyTasks: ['dailyTasks'],
        routineTasks: ['routineTasks'],
        // if an actual taskInstance is published directly, refresh both (safe)
        taskInstances: ['dailyTasks', 'routineTasks'],

        beenAwesomeWinners: ['beenAwesomeWinners'],
        tableBookings: ['tableBookings'],
        orders: ['orders'],

        // trim if asset updates only affect certain widgets
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
            // compare per bucket
            ;(
                Object.keys(rev.buckets) as (keyof Revision['buckets'])[]
            ).forEach((b) => {
                if ((rev.buckets[b] ?? 0) > (local.value.buckets[b] ?? 0)) {
                    bucketToKeys[b].forEach((k) => keys.add(k))
                }
            })

            if (keys.size) {
                await refreshNuxtData(Array.from(keys))
                local.value = rev
            } else {
                // no matching bucket — skip (don’t call refreshNuxtData())
                local.value = rev
            }
        } catch {
            // 401 if logged out, etc. — ignore or handle
        } finally {
            checking.value = false
        }
    }

    if (import.meta.client) {
        onMounted(() => {
            check()
            const { pause } = useIntervalFn(check, intervalMs)
            onBeforeUnmount(pause)
        })
    }
    return { check, local }
}
