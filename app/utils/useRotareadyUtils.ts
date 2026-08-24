import type { StepperItem } from '@nuxt/ui'

export const useRotareadyUtils = () => {
    const locationsStore = useLocationsStore()
    const staffDobStore = useStaffDobStore()
    const { getTime } = useDateUtils()

    const getTeamMemberById = (id: number) => {
        const allTeam: ComputedRef<TypeEmployee[]> = computed(
            () => locationsStore.getAllTeamMembers || []
        )
        return allTeam.value.find(
            (member: TypeEmployee) => member.fields.rotareadyId === id
        )
    }

    const getTeamMember = (shift: RotareadyShift) => {
        return getTeamMemberById(shift.user?.id)
    }

    const getShiftLength = (start: string, end: string): number => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diffInMs = endDate.getTime() - startDate.getTime()
        const diffInHours = diffInMs / (1000 * 60 * 60)
        return Math.round(diffInHours * 2) / 2 // nearest 0.5h
    }

    /**
     * UK Working Time Regulations rest-break minimums.
     * Young workers (under 18, over school leaving age) get a longer break
     * at a lower threshold than adults.
     */
    const ADULT_BREAK_RULE = { thresholdHours: 6, minutes: 20 }
    const YOUNG_WORKER_BREAK_RULE = { thresholdHours: 4.5, minutes: 30 }

    const getAgeOnDate = (dateOfBirth: string, on: Date): number => {
        const dob = new Date(dateOfBirth)
        let age = on.getFullYear() - dob.getFullYear()
        const monthDiff = on.getMonth() - dob.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < dob.getDate()))
            age--
        return age
    }

    /**
     * Work out the rest break a shift attracts, based on the team member's age
     * on the day of the shift. Date of birth comes from Rotaready (where it is
     * mandatory) via the staff DOB store — the Contentful `dateOfBirth` field
     * is a birthday with no reliable year and must not be used here.
     *
     * Falls back to the adult rule when the DOB hasn't loaded yet, so callers
     * should await `staffDobStore.ensureLoaded()` before rendering.
     */
    const getBreakEntitlement = (
        shift: RotareadyShift
    ): {
        thresholdHours: number
        minutes: number
        isYoungWorker: boolean
        hasDateOfBirth: boolean
        isRequired: boolean
    } => {
        const dateOfBirth = staffDobStore.getDateOfBirth(shift.user?.id)
        const isYoungWorker = dateOfBirth
            ? getAgeOnDate(dateOfBirth, new Date(shift.start)) < 18
            : false
        const rule = isYoungWorker ? YOUNG_WORKER_BREAK_RULE : ADULT_BREAK_RULE

        return {
            ...rule,
            isYoungWorker,
            hasDateOfBirth: !!dateOfBirth,
            isRequired:
                getShiftLength(shift.start, shift.end) > rule.thresholdHours
        }
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

    const getBadgeColour = (
        shiftName: string
    ): 'error' | 'neutral' | 'info' | 'warning' | 'success' | 'purple' => {
        switch (shiftName) {
            case 'Open':
            case 'Open (SL)':
                return 'success'
            case 'Close':
            case 'Close (SL)':
                return 'error'
            case 'Open & Close':
            case 'Open & Close (SL)':
                return 'purple'
            case 'Admin':
                return 'info'
            case 'Barista':
                return 'warning'
            default:
                return 'neutral'
        }
    }

    function formatBreaksLabel(
        shift: RotareadyShift,
        clockedOutAt?: string,
        breakIns?: string[],
        breakOuts?: string[]
    ): { label: string; icon: string; hasOngoing: boolean } {
        const { isRequired: suggested, minutes: requiredMinutes } =
            getBreakEntitlement(shift)
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
                label: suggested ? `Break (${requiredMinutes}m)` : 'Optional',
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

    const generateStepper = (
        shift: RotareadyShift,
        clockedInAt?: string,
        allBreakIns?: string[],
        allBreakOuts?: string[],
        clockedOutAt?: string,
        options?: { disableLateChecking?: boolean }
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

        // Disable late checking for future shifts (e.g., tomorrow's shifts)
        const disableLateChecking = options?.disableLateChecking ?? false
        const isLateToClockIn =
            !disableLateChecking && currentTime > shiftStartTime && !clockedInAt
        const isLateToClockOut =
            !disableLateChecking && currentTime > shiftEndTime && !clockedOutAt

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
        getTeamMemberById,
        generateStepper,
        getBadgeColour,
        getBreakEntitlement
    }
}
