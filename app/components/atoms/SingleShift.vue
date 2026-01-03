<template>
    <div class="relative flex w-full flex-row items-center justify-between">
        <transition name="fade">
            <div
                v-if="
                    getTeamMember(shift)?.fields?.photo?.[0]?.fields?.file?.url
                "
                class="flex w-32 items-center gap-2"
            >
                <u-avatar-group>
                    <img
                        v-if="
                            getTeamMember(shift)?.fields?.photo?.[0]?.fields
                                ?.file?.url
                        "
                        class="bg-tertiary size-8 shrink-0 rounded-full p-px"
                        :src="`${
                            getTeamMember(shift)?.fields?.photo?.[0]?.fields
                                ?.file?.url
                        }?w=90&h=90&fit=fill&f=face&fm=webp`"
                        :alt="getTeamMember(shift)?.fields?.name"
                    />
                    <div
                        v-else
                        class="from-tertiary-400 to-tertiary-600 size-8 rounded-full bg-linear-to-br"
                    />
                </u-avatar-group>
                <span class="flex w-16 flex-col items-start">
                    <span class="flex truncate">
                        {{ getTeamMember(shift)?.fields?.name }}
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
        </transition>

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
const { getTeamMember, generateStepper } = useRotareadyUtils()

interface Props {
    shift: RotareadyShift
}

defineProps<Props>()

const active: Ref<number> = ref(-1)
const { getBadgeColour } = useRotareadyUtils()
</script>
