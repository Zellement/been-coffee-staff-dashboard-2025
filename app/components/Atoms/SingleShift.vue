<template>
    <div class="flex w-full flex-row items-center justify-between">
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
                        class="from-tertiary-400 to-tertiary-600 size-8 rounded-full bg-gradient-to-br"
                    />
                </u-avatar-group>
                <span class="w-16 truncate">
                    {{ getTeamMember(shift)?.fields?.name }}
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
    </div>
</template>

<script lang="ts" setup>
const { getTeamMember, generateStepper } = useRotareadyUtils()

interface Props {
    shift: RotareadyShift
}

defineProps<Props>()

const active: Ref<number> = ref(-1)
</script>
