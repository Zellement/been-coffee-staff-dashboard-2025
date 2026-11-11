<template>
    <!-- <pre>{{ shiftsToday }}</pre> -->
    <div v-if="shiftsInLocation.length || roamingShifts.length">
        <carousel-title-and-action :title="title">
            <span class="pr-2">
                <u-badge size="xs" variant="outline">
                    {{ dateConverterWithDayNoYear(minDate) }}
                </u-badge>
            </span>
        </carousel-title-and-action>
        <div class="flex flex-col gap-1">
            <div v-for="item in shiftsInLocation" :key="item.id">
                <single-shift :shift="item" />
            </div>
            <div
                v-if="roamingShifts.length"
                class="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-butterscotch-300 bg-butterscotch-100 p-2.5 dark:border-navy-400 dark:bg-navy-700"
            >
                <div
                    v-for="item in roamingShifts"
                    :key="item.id"
                    class="flex flex-col gap-1.5"
                >
                    <div class="flex items-center gap-1.5 text-xs">
                        <u-badge
                            size="xs"
                            variant="subtle"
                            color="neutral"
                            :icon="
                                getShiftTypeLabel(item) === 'Admin'
                                    ? 'i-material-symbols-laptop-mac-outline'
                                    : 'i-material-symbols-coffee-outline'
                            "
                            :label="getShiftTypeLabel(item) ?? undefined"
                        />
                        <u-badge
                            v-if="getShiftSite(item)"
                            size="xs"
                            :variant="isAtThisShop(item) ? 'solid' : 'outline'"
                            :color="isAtThisShop(item) ? 'success' : 'primary'"
                            :label="getShiftSite(item) ?? undefined"
                        />
                    </div>
                    <single-shift :shift="item" />
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-col gap-2">
        <u-skeleton class="h-6 w-48" />
        <div v-for="i in 4" :key="i" class="flex gap-4">
            <u-skeleton class="size-10 rounded-full" />
            <u-skeleton class="h-10 w-20 rounded" />
            <u-skeleton class="h-10 w-full rounded" />
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    title: string
    minDate: string
    maxDate: string
}

const props = defineProps<Props>()
const locationsStore = useLocationsStore()

const { dateConverterWithDayNoYear } = useDateUtils()
const { isRoamingUser, isHeadOfficeShift, getShiftSite, getShiftTypeLabel } =
    useRotareadyUtils()

const { data: shiftsToday } = await useFetch('/api/rotaready/get-shifts', {
    params: {
        startDateMin: props.minDate,
        startDateMax: props.maxDate,
        endDateMin: props.minDate,
        endDateMax: props.maxDate
    }
})

const allShifts: ComputedRef<RotareadyShift[]> = computed(
    (): RotareadyShift[] => shiftsToday.value?.shifts ?? []
)

const isAtThisShop = (shift: RotareadyShift): boolean => {
    const postcode = locationsStore.activeLocation?.fields.postcode
    return !!postcode && shift.workEntityName.includes(postcode)
}

/**
 * Roaming staff (the Manager) and Head Office shifts go in their own box on
 * every shop, so both shops can see what they are doing and where
 */
const isInRoamingBox = (shift: RotareadyShift): boolean =>
    isRoamingUser(shift.user?.id) || isHeadOfficeShift(shift)

const shiftsInLocation: ComputedRef<RotareadyShift[]> = computed(
    (): RotareadyShift[] =>
        allShifts.value.filter(
            (shift: RotareadyShift): boolean =>
                isAtThisShop(shift) && !isInRoamingBox(shift)
        )
)

const roamingShifts: ComputedRef<RotareadyShift[]> = computed(
    (): RotareadyShift[] =>
        allShifts.value
            .filter(isInRoamingBox)
            .sort(
                (a: RotareadyShift, b: RotareadyShift): number =>
                    +new Date(a.start) - +new Date(b.start)
            )
)

// Rest-break entitlement depends on age, so load dates of birth before the
// break labels render
await useStaffDobStore().ensureLoaded()
</script>
