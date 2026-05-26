<template>
    <u-card variant="subtle" class="flex w-44 shrink-0 flex-col gap-3">
        <div class="mb-1 flex items-center gap-2">
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
                <span class="truncate text-sm leading-tight">
                    {{ teamMember?.fields?.name ?? absence.user.firstName }}
                </span>
                <span class="truncate text-xs">
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

        <div class="mt-1 flex gap-1 text-sm">
            <u-badge
                variant="outline"
                class="flex flex-col items-start text-left"
            >
                <span class="text-left text-2xs leading-none uppercase">
                    Starts
                </span>

                <span class="text-left text-xs leading-none">
                    {{ formatDate(absence.localDateStart) }}
                </span>
            </u-badge>
            <u-badge
                v-if="!absence.singleDay"
                variant="outline"
                class="flex flex-col items-start"
            >
                <span class="text-left text-2xs leading-none uppercase">
                    Returns
                </span>
                <span class="text-left text-xs leading-none">
                    {{ formatDate(absence.localDateEnd) }}
                </span>
            </u-badge>
        </div>
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
