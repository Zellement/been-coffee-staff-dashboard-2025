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
        clockedOutAt?: string
    ): StepperItem[] => {
        return [
            {
                title: clockedInAt
                    ? getTime(clockedInAt)
                    : getTime(shift.start),
                icon: 'iconamoon:enter-fill'
            },
            getShiftLength(shift.start, shift.end) > 6
                ? {
                      title: 'Suggested',
                      icon: 'ph:armchair-fill'
                  }
                : {
                      title: 'Optional',
                      icon: 'ph:armchair-light'
                  },
            getShiftLength(shift.start, shift.end) > 6
                ? {
                      title: 'End',
                      icon: 'ph:armchair-fill'
                  }
                : {
                      title: 'End',
                      icon: 'ph:armchair-light'
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
