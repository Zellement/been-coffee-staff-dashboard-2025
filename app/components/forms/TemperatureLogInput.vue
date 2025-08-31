<template>
    <label
        class="grid w-full grid-cols-12 justify-between gap-2 lg:items-center"
    >
        <span class="col-span-full font-bold md:col-span-4">
            {{ item }}
        </span>
        <span
            class="relative col-span-5 grid grid-cols-2 items-center justify-center gap-1 md:col-span-3 md:col-start-5"
        >
            <u-button
                :variant="dynamicMinusVariant"
                color="info"
                @click="togglePlusMinus('minus')"
            >
                Below 0&deg;
            </u-button>
            <u-button
                :variant="dynamicPlusVariant"
                color="error"
                @click="togglePlusMinus('plus')"
            >
                Above 0&deg;
            </u-button>
        </span>
        <u-input
            v-model="input"
            type="number"
            variant="outline"
            class="col-span-4 col-start-6 text-center md:col-span-2 md:col-start-9"
            min="0"
            :name="`${item} raw`"
            step=".1"
            required
        />
        <input
            :name="item"
            readonly
            class="pointer-events-none col-span-2 col-start-11 bg-transparent text-center"
            :value="valueString"
        />
    </label>
</template>

<script lang="ts" setup>
interface Props {
    item: string
    plusOrMinus?: PlusOrMinus
}

const props = withDefaults(defineProps<Props>(), {
    item: '',
    plusOrMinus: 'plus'
})

const dynamicPlusVariant = computed(() => {
    return state.plusOrMinus === 'plus' ? 'solid' : 'outline'
})

const dynamicMinusVariant = computed(() => {
    return state.plusOrMinus === 'minus' ? 'solid' : 'outline'
})

const input = ref()

const state = reactive({
    plusOrMinus: props.plusOrMinus
})

const togglePlusMinus = (value: PlusOrMinus) => {
    state.plusOrMinus = value
}

const isAboveZero: ComputedRef<string> = computed(() => {
    return state.plusOrMinus === 'plus' ? '+' : '-'
})

const valueString = computed(() => {
    return input.value ? `${isAboveZero.value}${input.value}°C` : '- -'
})
</script>
