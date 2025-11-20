<template>
    <button :class="['calendar__box aspect-square']" @click="toggleDoor">
        <div
            class="door relative z-20"
            :class="[
                doorIsOpen ? 'doorOpen' : '',
                hasWinners ? 'overflow-clip rounded-br-3xl' : ''
            ]"
        >
            <span
                class="absolute top-1 left-1 z-10 p-0 px-1 py-0.5 text-xs text-white opacity-70"
            >
                {{ day }}
            </span>
        </div>

        <div
            v-for="employee in winners"
            :key="employee?.sys?.id"
            class="flex flex-col items-center gap-2 text-center text-white"
        >
            <img
                v-if="getTeamMember(employee?.sys?.id).photo"
                class="h-full w-full object-cover"
                :src="`${getTeamMember(employee?.sys?.id).photo}?w=150&h=150&fit=fill&f=face&fm=webp`"
                :alt="getTeamMember(employee?.sys?.id).name"
            />
            <u-badge
                class="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0"
            >
                {{ getTeamMember(employee?.sys?.id).name }}
            </u-badge>
        </div>
    </button>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

interface Props {
    day: string
    isOpen?: boolean
    winners?: TypeEmployee[]
}

const props = defineProps<Props>()

const doorIsOpen: Ref<boolean> = ref(props.isOpen ?? false)

const getTeamMember = (id: string) => {
    const member = locationsStore?.getAllTeamMembers?.find(
        (member) => member?.sys?.id === id
    )
    return {
        name: member?.fields?.name || 'Unknown',
        photo: member?.fields?.photo?.[0]?.fields?.file?.url || []
    }
}

const hasWinners: ComputedRef<boolean> = computed(() => {
    return !!props.winners && props.winners.length > 0
})

watch(
    () => props.isOpen,
    (newVal) => {
        doorIsOpen.value = newVal ?? false
    }
)

const toggleDoor = () => {
    doorIsOpen.value = !doorIsOpen.value
}
</script>

<style scoped>
.calendar__box {
    position: relative;
    background: var(--color-tuscany-700);
}

.calendar__box {
    &:nth-of-type(8n + 1),
    &:nth-of-type(8n + 3),
    &:nth-of-type(8n + 6),
    &:nth-of-type(8n + 8) {
        background: var(--color-tuscany-800);
    }
}

@media (min-width: 878px) {
    .calendar__box {
        &:nth-of-type(8n + 1),
        &:nth-of-type(8n + 3),
        &:nth-of-type(8n + 6),
        &:nth-of-type(8n + 8) {
            background: transparent;
        }
    }
    .calendar__box {
        &:nth-of-type(12n + 1),
        &:nth-of-type(12n + 3),
        &:nth-of-type(12n + 5),
        &:nth-of-type(12n + 8),
        &:nth-of-type(12n + 10),
        &:nth-of-type(12n + 12) {
            background: var(--color-tuscany-500);
        }
    }
}

@media (min-width: 1268px) {
    .calendar__box {
        &:nth-of-type(12n + 1),
        &:nth-of-type(12n + 3),
        &:nth-of-type(12n + 5),
        &:nth-of-type(12n + 8),
        &:nth-of-type(12n + 10),
        &:nth-of-type(12n + 12) {
            background: transparent;
        }
    }
    .calendar__box {
        &:nth-of-type(1),
        &:nth-of-type(3),
        &:nth-of-type(5),
        &:nth-of-type(7),
        &:nth-of-type(9),
        &:nth-of-type(11),
        &:nth-of-type(14),
        &:nth-of-type(16),
        &:nth-of-type(18),
        &:nth-of-type(20),
        &:nth-of-type(22),
        &:nth-of-type(24) {
            background: var(--color-tuscany-500);
        }
    }
}

.door {
    background: linear-gradient(
        135deg,
        var(--color-tuscany-700) 0%,
        var(--color-tuscany-600) 50%,
        var(--color-tuscany-500) 100%
    );
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    transform-origin: left;
    /*Speed of the Door animation*/
    transition: all 0.5s ease-in-out;
}

.dark .door {
}

.doorOpen {
    /*prespectiv creates the door open effect*/
    transform: perspective(600px) translateZ(0px) translateX(0px)
        translateY(0px) rotateY(-105deg);
}
</style>
