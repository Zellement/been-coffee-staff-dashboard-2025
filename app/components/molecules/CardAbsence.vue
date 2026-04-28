<template>
    <u-card variant="subtle" class="flex w-44 shrink-0 flex-col gap-3">
        <div class="flex items-center gap-2">
            <img
                v-if="teamMember?.fields?.photo?.[0]?.fields?.file?.url"
                class="bg-tertiary size-8 shrink-0 rounded-full object-cover p-px"
                :src="`${teamMember.fields.photo[0].fields.file.url}?w=90&h=90&fit=fill&f=face&fm=webp`"
                :alt="teamMember.fields.name"
            />
            <div
                v-else
                class="from-tertiary-400 to-tertiary-600 size-8 shrink-0 rounded-full bg-linear-to-br"
            />
            <span class="flex min-w-0 flex-col">
                <span class="truncate text-sm leading-tight font-medium">
                    {{ teamMember?.fields?.name ?? absence.user.firstName }}
                </span>
                <span class="truncate text-xs text-neutral-400">
                    {{
                        teamMember?.fields?.jobRole
                            ? `${teamMember.fields.jobRole}${teamMember.fields.jobRoleAddendum ? ` (${teamMember.fields.jobRoleAddendum})` : ''}`
                            : absence.user.appointment.positionName
                    }}
                </span>
            </span>
        </div>

        <u-badge
            size="sm"
            variant="subtle"
            :style="{
                backgroundColor: `${absence.type.colour}33`,
                color: absence.type.colour
            }"
        >
            {{ absence.type.name }}
        </u-badge>

        <div class="flex gap-1 text-sm text-neutral-400">
            <div>{{ formatDate(absence.localDateStart) }}</div>
            <div v-if="!absence.singleDay">
                to {{ formatDate(absence.localDateEnd) }}
            </div>
        </div>

        <u-badge size="sm" variant="outline" color="neutral">
            {{ absence.totalDays }}
            {{ absence.totalDays === 1 ? 'day' : 'days' }}
        </u-badge>
    </u-card>
</template>

<script lang="ts" setup>
interface Props {
    absence: RotareadyAbsence
}

const props = defineProps<Props>()

const { getTeamMemberById } = useRotareadyUtils()
const { getMonthAndDayOnly } = useDateUtils()

const teamMember = computed(() => getTeamMemberById(props.absence.userId))

const formatDate = (dateStr: string): string => {
    return getMonthAndDayOnly(dateStr)
}
</script>
