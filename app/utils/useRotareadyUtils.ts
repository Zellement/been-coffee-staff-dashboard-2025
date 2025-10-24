import type { StepperItem } from '@nuxt/ui'

export const useRotareadyUtils = () => {
    const locationsStore = useLocationsStore()
    const { getTime } = useDateUtils()

    const getTeamMember = (shift: RotareadyShift) => {
        const allTeam: ComputedRef<TypeEmployee[]> = computed(
            () => locationsStore.getAllTeamMembers || []
        )
        return allTeam.value.find(
            (member: TypeEmployee) =>
                member.fields.rotareadyId === shift.user?.id
        )
    }

    const getShiftLength = (start: string, end: string): number => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diffInMs = endDate.getTime() - startDate.getTime()
        const diffInHours = diffInMs / (1000 * 60 * 60)
        return Math.round(diffInHours * 2) / 2 // nearest 0.5h
    }

    const sortIso = (arr?: string[]) =>
        (arr ?? []).slice().sort((a, b) => +new Date(a) - +new Date(b))

    function pairBreaks(breakIns?: string[], breakOuts?: string[]) {
        const ins = sortIso(breakIns)
        const outs = sortIso(breakOuts)
        const pairs: Array<{ start: string; end?: string }> = []

        for (let i = 0; i < ins.length; i++) {
            const start = ins[i]
            const end = outs[i] // if missing, it's an ongoing break
            if (start) pairs.push({ start, end })
        }
        return pairs
    }

    function formatBreaksLabel(
        shift: RotareadyShift,
        clockedOutAt?: string,
        breakIns?: string[],
        breakOuts?: string[]
    ): { label: string; icon: string; hasOngoing: boolean } {
        const suggested = getShiftLength(shift.start, shift.end) > 6
        const pairs = pairBreaks(breakIns, breakOuts)
        const hasOngoing = pairs.some((p) => !p.end)

        if (pairs.length === 0) {
            // no breaks logged
            if (clockedOutAt)
                return {
                    label: '--',
                    icon: suggested ? 'ph:armchair-fill' : 'ph:armchair-thin',
                    hasOngoing: false
                }
            return {
                label: suggested ? 'Break' : 'Optional',
                icon: suggested ? 'ph:armchair-fill' : 'ph:armchair-thin',
                hasOngoing: false
            }
        }

        const parts = pairs.map((p) =>
            p.end
                ? `${getTime(p.start)} - ${getTime(p.end)}`
                : `Break since ${getTime(p.start)}`
        )

        return {
            label: parts.join(', '),
            icon: hasOngoing
                ? 'i-line-md-loading-twotone-loop'
                : suggested
                  ? 'ph:armchair-fill'
                  : 'ph:armchair-thin',
            hasOngoing
        }
    }

    // --- updated API: accepts arrays for breaks ---
    const generateStepper = (
        shift: RotareadyShift,
        clockedInAt?: string,
        allBreakIns?: string[],
        allBreakOuts?: string[],
        clockedOutAt?: string
    ): StepperItem[] => {
        const { label: breakText, icon: breakIcon } = formatBreaksLabel(
            shift,
            clockedOutAt,
            allBreakIns,
            allBreakOuts
        )

        const now = new Date()
        const currentTime = getTime(now.toISOString())
        const shiftStartTime = getTime(shift.start)
        const shiftEndTime = getTime(shift.end)

        const isLateToClockIn = currentTime > shiftStartTime && !clockedInAt
        const isLateToClockOut = currentTime > shiftEndTime && !clockedOutAt

        const clockInStep: StepperItem = {
            title: clockedInAt
                ? getTime(clockedInAt)
                : isLateToClockIn
                  ? 'Please clock in'
                  : shiftStartTime,
            icon: isLateToClockIn ? 'i-noto-warning' : 'iconamoon:enter-fill'
        }

        const clockOutStep: StepperItem = {
            title: clockedOutAt
                ? getTime(clockedOutAt)
                : isLateToClockOut
                  ? 'Please clock out'
                  : shiftEndTime,
            icon: isLateToClockOut ? 'i-noto-warning' : 'iconamoon:exit-fill'
        }

        return [
            clockInStep,
            { title: breakText, icon: breakIcon },
            clockOutStep
        ]
    }

    return {
        getTeamMember,
        generateStepper
    }
}
