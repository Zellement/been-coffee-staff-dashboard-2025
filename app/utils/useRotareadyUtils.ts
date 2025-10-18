export const useRotareadyUtils = () => {
    const locationsStore = useLocationsStore()

    const getTeamMember = (shift: RotareadyShift) => {
        const allTeam: ComputedRef<TypeEmployee[]> = computed(() => {
            return locationsStore.getAllTeamMembers || []
        })

        return allTeam.value.find(
            (member: TypeEmployee) =>
                member.fields.rotareadyId === shift.user?.id
        )
    }

    return {
        getTeamMember
    }
}
