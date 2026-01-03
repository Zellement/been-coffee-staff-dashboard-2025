<template>
    <div class="flex w-full flex-row items-center justify-between">
        <div class="flex w-32 items-center gap-2">
            <u-avatar-group>
                <img
                    v-if="singleEvent.userPhoto"
                    class="bg-tertiary size-8 shrink-0 rounded-full p-px"
                    :src="`${singleEvent.userPhoto}?w=90&h=90&fit=fill&f=face&fm=webp`"
                    :alt="singleEvent.userName"
                />
                <div
                    v-else
                    class="from-tertiary-400 to-tertiary-600 size-8 rounded-full bg-linear-to-br"
                />
            </u-avatar-group>
            <span class="w-16 truncate">
                {{ singleEvent.userName }}
            </span>
        </div>

        <div
            class="relative flex w-full grow items-center"
            :class="hasMoreThanFourEvents ? 'gap-2' : 'gap-1 lg:gap-4'"
        >
            <div
                class="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-linear-to-r from-tuscany-500 to-seashell-300 dark:from-navy-400 dark:to-navy-600"
            />
            <template
                v-for="(e, index) in singleEvent.events"
                :key="`${e.title}-${e.description}`"
            >
                <div
                    v-if="e.description !== 'Clocked out'"
                    class="relative rounded bg-white dark:bg-navy-500"
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
                            ? 'size-4! animate-pulse text-tuscany-500 dark:text-butterscotch-200'
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
                :items="singleEvent.events"
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
    singleEvent: TransformedUser
}

const props = defineProps<Props>()

const hasClockedOut = computed(() => {
    return props.singleEvent.events.some((e) => e.description === 'Clocked out')
})

const clockedOutTime: ComputedRef<string> = computed(() => {
    const clockOutEvent = props.singleEvent.events.find(
        (e) => e.description === 'Clocked out'
    )
    return clockOutEvent?.title ? clockOutEvent?.title : ''
})

const isOnBreak = computed(() => {
    const lastEvent =
        props.singleEvent.events[props.singleEvent.events.length - 1] || null
    return lastEvent?.description === 'Break on'
})

const hasMoreThanFourEvents = computed(() => {
    return props.singleEvent.events.length > 4
})

const multipleEvents = (index: number) => {
    return hasMoreThanFourEvents.value && index !== 0
}

// const { getTeamMember } = useRotareadyUtils()
</script>
