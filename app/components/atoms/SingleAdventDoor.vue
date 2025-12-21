<template>
    <button :class="['relative aspect-square']" @click="toggleDoor">
        <div
            class="door relative z-20"
            :class="[
                doorIsOpen ? 'doorOpen' : '',
                isShaking ? 'shake' : '',
                hasWinners
                    ? 'overflow-clip rounded-br-3xl'
                    : 'border-2 border-dotted border-butterscotch-500 dark:border-navy-400'
            ]"
        >
            <span
                class="absolute top-1 left-1 z-10 p-0 px-1 py-0.5 text-xs text-white opacity-70"
            >
                {{ day }}
            </span>
        </div>

        <u-carousel
            v-slot="{ item }"
            :items="winners"
            :dots="hasMultipleWinners"
            :ui="{ dots: '-translate-y-8 ' }"
        >
            <div
                :key="item?.sys?.id"
                class="relative flex aspect-square h-full w-full flex-col items-center gap-2 text-center text-white"
            >
                <img
                    v-if="getTeamMember(item?.sys?.id).photo"
                    class="h-full w-full object-cover"
                    :src="`${getTeamMember(item?.sys?.id).photo}?w=150&h=150&fit=fill&f=face&fm=webp`"
                    :alt="getTeamMember(item?.sys?.id).name"
                />
                <u-badge
                    class="absolute left-1/2 -translate-x-1/2 px-1.5 py-0"
                    :class="hasMultipleWinners ? 'bottom-5' : 'bottom-2'"
                >
                    {{ getTeamMember(item?.sys?.id).name }}
                </u-badge>
            </div>
        </u-carousel>
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
const isShaking: Ref<boolean> = ref(false)

const getTeamMember = (id: string) => {
    const member = locationsStore?.getAllTeamMembers?.find(
        (member) => member?.sys?.id === id
    )
    return {
        name: member?.fields?.name || 'Former Team Member',
        photo: member?.fields?.photo?.[0]?.fields?.file?.url || null
    }
}

const hasWinners: ComputedRef<boolean> = computed(() => {
    return !!props.winners && props.winners.length > 0
})

const hasMultipleWinners: ComputedRef<boolean> = computed(() => {
    return !!props.winners && props.winners.length > 1
})

watch(
    () => props.isOpen,
    (newVal) => {
        if (hasWinners.value) {
            doorIsOpen.value = newVal ?? false
        }
    }
)

const toggleDoor = () => {
    // If no winners, just add an animation and shake the door
    if (!hasWinners.value) {
        isShaking.value = true
        setTimeout(() => {
            isShaking.value = false
        }, 500)
        return
    }
    doorIsOpen.value = !doorIsOpen.value
}
</script>

<style scoped>
.door {
    background: linear-gradient(
        135deg,
        var(--color-butterscotch-700) 0%,
        var(--color-butterscotch-500) 50%,
        var(--color-butterscotch-300) 100%
    );
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    transform-origin: left;
    /*Speed of the Door animation*/
    transition: all 0.7s ease-in-out;
}

.dark .door {
    background: linear-gradient(
        135deg,
        var(--color-navy-900) 0%,
        var(--color-navy-800) 50%,
        var(--color-navy-500) 100%
    );
}

.doorOpen {
    /*prespectiv creates the door open effect*/
    transform: perspective(600px) translateZ(0px) translateX(0px)
        translateY(0px) rotateY(-105deg);
}

.shake {
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%,
    100% {
        transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-2px) rotate(-1deg);
    }
    20%,
    40%,
    60%,
    80% {
        transform: translateX(2px) rotate(1deg);
    }
}
</style>
