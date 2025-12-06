<template>
    <div class="flex w-full flex-row items-center justify-between">
        <div class="flex w-32 items-center gap-2">
            <u-avatar-group>
                <img
                    v-if="event.userPhoto"
                    class="bg-tertiary size-8 shrink-0 rounded-full p-px"
                    :src="`${event.userPhoto}?w=90&h=90&fit=fill&f=face&fm=webp`"
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

        <div
            class="relative flex w-full grow items-center"
            :class="hasMoreThanFourEvents ? 'gap-2' : 'gap-1 lg:gap-4'"
        >
            <div
                class="dark:from-navy-400 dark:to-navy-600 from-tuscany-500 to-seashell-300 absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-linear-to-r"
            />
            <template
                v-for="(e, index) in event.events"
                :key="`${e.title}-${e.description}`"
            >
                <div
                    v-if="e.description !== 'Clocked out'"
                    class="dark:bg-navy-500 relative rounded bg-white"
                    :class="[
                        e.description === 'Clocked in' ? 'mr-auto' : '',
                        multipleEvents(index) ? '' : 'ml-0'
                    ]"
                >
                    <u-badge
                        :variant="e.variant"
                        :color="e.color"
                        :icon="e.icon"
                        :size="multipleEvents(index) ? 'sm' : 'md'"
                        :label="multipleEvents(index) ? undefined : e.title"
                    />
                </div>
            </template>
            <u-badge
                v-if="hasClockedOut"
                class="relative ml-auto"
                variant="solid"
                color="error"
                icon="i-material-symbols-logout"
                :label="clockedOutTime"
            />
            <div v-else class="relative ml-auto flex w-14.5">
                <u-icon
                    class="ml-auto"
                    :class="
                        isOnBreak
                            ? 'text-tuscany-500 dark:text-butterscotch-200 size-4! animate-pulse'
                            : 'text-primary opacity-20 dark:opacity-60'
                    "
                    :name="
                        isOnBreak ? 'ph:armchair-fill' : 'i-svg-spinners-clock'
                    "
                />
            </div>
            <!--
                <u-timeline
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

const props = defineProps<Props>()

const hasClockedOut = computed(() => {
    return props.event.events.some((e) => e.description === 'Clocked out')
})

const clockedOutTime: ComputedRef<string> = computed(() => {
    const clockOutEvent = props.event.events.find(
        (e) => e.description === 'Clocked out'
    )
    return clockOutEvent?.title ? clockOutEvent?.title : ''
})

const isOnBreak = computed(() => {
    const lastEvent = props.event.events[props.event.events.length - 1] || null
    return lastEvent?.description === 'Break on'
})

const hasMoreThanFourEvents = computed(() => {
    return props.event.events.length > 4
})

const multipleEvents = (index: number) => {
    return hasMoreThanFourEvents.value && index !== 0
}

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
