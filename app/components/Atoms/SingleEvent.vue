<template>
    <div class="flex w-full flex-row items-center justify-between">
        <div class="flex w-32 items-center gap-2">
            <u-avatar-group>
                <img
                    v-if="event.userPhoto"
                    class="bg-tertiary size-8 rounded-full p-px"
                    :src="`${event.userPhoto}?w=30&h=30&fit=fill&f=face&fm=webp`"
                    :alt="event.userName"
                />
                <div
                    v-else
                    class="from-tertiary-400 to-tertiary-600 size-8 rounded-full bg-linear-to-br"
                />
            </u-avatar-group>
            <span class="w-16 truncate">
                {{ event.userName }}
            </span>
        </div>

        <div class="flex w-full grow items-start gap-2">
            <div v-for="e in event.events" :key="`${e.title}-${e.description}`">
                <u-badge
                    :variant="e.variant"
                    :color="e.color"
                    :icon="e.icon"
                    :label="e.title"
                />
            </div>
            <!-- <u-timeline
                v-model="active"
                color="secondary"
                disabled
                orientation="horizontal"
                :items="event.events"
                size="xs"
                :ui="{
                    root: 'w-full',
                    title: '-mt-3 text-xs',
                    description: 'text-xs -mt-2'
                }"
            /> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    event: TransformedUser
}

defineProps<Props>()

// const active: Ref<number> = ref(-1)

// const getIcon = (description: string): string => {
//     if (description.includes('Clocked in')) {
//         return 'plus'
//     } else if (description.includes('deleted')) {
//         return 'trash'
//     } else if (description.includes('updated')) {
//         return 'pencil'
//     } else {
//         return 'info-circle'
//     }
// }
</script>
