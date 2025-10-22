import type { StepperItem } from '@nuxt/ui'

export const useRotareadyUtils = () => {
    const locationsStore = useLocationsStore()
    const { getTime } = useDateUtils()

    const getTeamMember = (shift: RotareadyShift) => {
        const allTeam: ComputedRef<TypeEmployee[]> = computed(() => {
            return locationsStore.getAllTeamMembers || []
        })

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
        return Math.round(diffInHours * 2) / 2 // Round to nearest half hour
    }

    const generateStepper = (
        shift: RotareadyShift,
        clockedInAt?: string,
        breakInAt?: string,
        breakOffAt?: string,
        clockedOutAt?: string
    ): StepperItem[] => {
        const breakIsSuggested: ComputedRef<boolean> = computed(() => {
            return getShiftLength(shift.start, shift.end) > 6
        })

        const breakText: ComputedRef<string> = computed(() => {
            if (breakInAt && breakOffAt) {
                return `${getTime(breakInAt)} - ${getTime(breakOffAt)}`
            }
            if (breakInAt) {
                return `Break since ${getTime(breakInAt)}`
            }
            if (breakIsSuggested.value) {
                return 'Break'
            }
            if (clockedOutAt && !breakInAt && !breakOffAt) {
                return '--'
            }
            return 'Optional'
        })

        const breakIcon: ComputedRef<string> = computed(() => {
            if (breakInAt && !breakOffAt) {
                return 'i-line-md-loading-twotone-loop'
            }
            return breakIsSuggested.value
                ? 'ph:armchair-fill'
                : 'ph:armchair-thin'
        })

        return [
            {
                title: clockedInAt
                    ? getTime(clockedInAt)
                    : getTime(shift.start),
                icon: 'iconamoon:enter-fill'
            },
            {
                title: breakText.value,
                icon: breakIcon.value
            },
            {
                title: clockedOutAt
                    ? getTime(clockedOutAt)
                    : getTime(shift.end),
                icon: 'iconamoon:exit-fill'
            }
        ]
    }

    return {
        getTeamMember,
        generateStepper
    }
}
