<template>
    <button :class="['calendar__box aspect-square p-2']" @click="toggleDoor">
        <div class="door relative z-20" :class="doorIsOpen ? 'doorOpen' : ''">
            <span
                class="absolute top-1 left-1 z-10 p-0 px-1 py-0.5 text-xs text-white opacity-70"
            >
                {{ day }}
            </span>
        </div>
    </button>
</template>

<script lang="ts" setup>
interface Props {
    day: string
    isOpen?: boolean
}

const props = defineProps<Props>()

const doorIsOpen: Ref<boolean> = ref(props.isOpen ?? false)

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
    background: var(--color-tuscany-300);
}

.calendar__box {
    &:nth-of-type(8n + 1),
    &:nth-of-type(8n + 3),
    &:nth-of-type(8n + 6),
    &:nth-of-type(8n + 8) {
        background: var(--color-tuscany-500);
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
    box-shadow: 2px 2px 2px;

    transform-origin: left;
    /*Speed of the Door animation*/
    transition: all 0.5s ease-in-out;
}

.dark .door {
    box-shadow: 1px 0 0 0 black;
}

.doorOpen {
    /*prespectiv creates the door open effect*/
    transform: perspective(600px) translateZ(0px) translateX(0px)
        translateY(0px) rotateY(-105deg);
}
</style>
