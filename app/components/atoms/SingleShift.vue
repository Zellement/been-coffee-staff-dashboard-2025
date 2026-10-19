<template>
    <div class="relative flex w-full flex-row items-center justify-between">
        <div class="flex w-32 shrink-0 items-center gap-2">
            <u-avatar-group>
                <img
                    v-if="photoUrl"
                    class="bg-tertiary size-8 shrink-0 rounded-full p-px"
                    :src="`${photoUrl}?w=90&h=90&fit=fill&f=face&fm=webp`"
                    :alt="name"
                />
                <div
                    v-else
                    class="from-tertiary-400 to-tertiary-600 size-8 rounded-full bg-linear-to-br"
                />
            </u-avatar-group>
            <span class="flex w-16 flex-col items-start">
                <span class="flex truncate">
                    {{ name }}
                </span>
                <u-badge
                    :label="shift?.shiftType?.name"
                    size="3xs"
                    variant="subtle"
                    :color="getBadgeColour(shift?.shiftType?.name)"
                    class="truncate opacity-50"
                />
            </span>
        </div>

        <div class="w-full grow">
            <UStepper
                v-model="active"
                disabled
                :items="
                    generateStepper(shift, undefined, [], [], undefined, {
                        disableLateChecking: true
                    })
                "
                size="xs"
            />
        </div>

        <!-- class="absolute top-0 right-0" -->
    </div>
</template>

<script lang="ts" setup>
const { getTeamMember, generateStepper, getBadgeColour } = useRotareadyUtils()

interface Props {
    shift: RotareadyShift
}

const props = defineProps<Props>()

const teamMember: ComputedRef<TypeEmployee | undefined> = computed(
    (): TypeEmployee | undefined => getTeamMember(props.shift)
)

const photoUrl: ComputedRef<string | undefined> = computed(
    (): string | undefined =>
        teamMember.value?.fields?.photo?.[0]?.fields?.file?.url as
            | string
            | undefined
)

// Fall back to Rotaready's name for anyone not set up in Contentful yet
const name: ComputedRef<string> = computed(
    (): string =>
        teamMember.value?.fields?.name ?? props.shift.user?.firstName ?? ''
)

const active: Ref<number> = ref(-1)
</script>
