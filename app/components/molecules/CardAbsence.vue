<template>
    <u-card variant="subtle" class="flex w-44 shrink-0 flex-col gap-3">
        <div class="flex items-center gap-2">
            <img
                v-if="absence.user.picture"
                class="size-8 shrink-0 rounded-full object-cover"
                :src="absence.user.picture"
                :alt="`${absence.user.firstName} ${absence.user.lastName}`"
            />
            <div
                v-else
                class="from-tertiary-400 to-tertiary-600 size-8 shrink-0 rounded-full bg-linear-to-br"
            />
            <span class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium leading-tight">
                    {{ absence.user.firstName }}
                    {{ absence.user.lastName }}
                </span>
                <span class="truncate text-xs text-neutral-400">
                    {{ absence.user.appointment.positionName }}
                </span>
            </span>
        </div>

        <u-badge
            size="xs"
            variant="subtle"
            :style="{
                backgroundColor: `${absence.type.colour}33`,
                color: absence.type.colour
            }"
        >
            {{ absence.type.name }}
        </u-badge>

        <div class="text-xs text-neutral-400">
            <div>{{ formatDate(absence.localDateStart) }}</div>
            <div v-if="!absence.singleDay">
                to {{ formatDate(absence.localDateEnd) }}
            </div>
        </div>

        <u-badge size="xs" variant="outline" color="neutral">
            {{ absence.totalDays }}
            {{ absence.totalDays === 1 ? 'day' : 'days' }}
        </u-badge>

        <div class="truncate text-xs text-neutral-500">
            {{ absence.user.appointment.entityName }}
        </div>
    </u-card>
</template>

<script lang="ts" setup>
interface Props {
    absence: RotareadyAbsence
}

defineProps<Props>()

const { getMonthAndDayOnly } = useDateUtils()

const formatDate = (dateStr: string): string => {
    return getMonthAndDayOnly(dateStr)
}
</script>
