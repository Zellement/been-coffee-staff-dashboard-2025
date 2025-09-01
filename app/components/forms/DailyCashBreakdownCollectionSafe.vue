<template>
    <div class="border-seashell-600 dark:border-navy-300 border-b pb-8">
        <div
            class="sticky top-0 mb-6 grid grid-cols-6 justify-between gap-2 py-1.5"
        >
            <div class="col-span-3 flex flex-row gap-3 self-end md:col-span-4">
                <div class="flex w-4 self-stretch" :class="style" />
                <div class="flex flex-col">
                    <p class="">
                        {{ titleBrow }}
                    </p>
                    <h3 class="uc-text !m-0">
                        {{ title }}
                    </h3>
                </div>
            </div>
            <div
                class="col-span-3 flex w-full flex-row justify-between md:col-span-2"
            >
                <p
                    class="transform-all flex flex-col justify-between self-end leading-none duration-300"
                >
                    <span class="text-2xs text-right">Total</span>

                    <input
                        tabindex="-1"
                        readonly
                        :class="totalColor"
                        :value="totalValueFormatted"
                        :name="`${collection} total`"
                        class="w-full text-right"
                    />
                </p>
                <p
                    class="denominations-end transform-all mt-auto flex flex-col justify-between self-end leading-none duration-300"
                >
                    <span class="text-2xs text-right">
                        <Icon
                            name="mdi:plus-minus-variant"
                            class="mx-auto flex h-3 w-3"
                        />
                    </span>
                    <input
                        tabindex="-1"
                        readonly
                        :class="differenceColor"
                        :value="differenceFormatted"
                        :name="`${collection} difference`"
                        class="w-full text-right"
                    />
                </p>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <div class="grid grid-cols-12 items-center">
                <span class="col-span-2 font-bold">Cash</span>
                <span class="col-span-5 font-bold">Value</span>
                <span class="col-span-5 font-bold">Bag / Note Count</span>
            </div>
            <div
                v-for="denomination in state.denominations"
                :key="`black-tin__${denomination}`"
                class="grid grid-cols-12 items-center"
            >
                <span class="col-span-2">{{ denomination.denomination }}</span>
                <input
                    class="pointer-events-none col-span-5"
                    readonly
                    tabindex="-1"
                    :value="getValue(denomination)"
                    :name="`${collection} ${denomination.denomination} value`"
                />
                <u-input
                    v-model="denomination.value"
                    class="col-span-5"
                    :name="`${collection} ${denomination.denomination} count`"
                    type="number"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    collection?: string
    collectionBrow?: string | null
    collectionStyle?: string
}

const props = defineProps<Props>()

const title = computed(() => {
    return props.collection
})

const titleBrow = computed(() => {
    return props.collectionBrow
})

const style = computed(() => {
    return props.collectionStyle
})
const state = reactive({
    denominations: [
        { denomination: '£20', value: 0, multiple: 20 },
        { denomination: '£10', value: 0, multiple: 10 },
        { denomination: '£5', value: 0, multiple: 5 },
        { denomination: '£2', value: 0, multiple: 20 },
        { denomination: '£1', value: 0, multiple: 20 },
        { denomination: '50p', value: 0, multiple: 10 },
        { denomination: '20p', value: 0, multiple: 10 },
        { denomination: '10p', value: 0, multiple: 5 },
        { denomination: '5p', value: 0, multiple: 5 }
    ]
})

const formatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP'
})

const getValue = (denomination: { value: number; multiple: number }) => {
    return formatter.format(denomination.value * denomination.multiple)
}

const totalValue = computed(() => {
    let value = 0
    state.denominations.forEach((element) => {
        value = value + element.value * element.multiple
    })
    return value
})

const totalValueFormatted = computed(() => {
    return totalValue.value === 0
        ? '£--.--'
        : formatter.format(totalValue.value)
})

const totalColor = computed(() => {
    return totalValue.value === 0 ? 'opacity-20' : null
})

const difference = computed(() => {
    return totalValue.value - 150
})

const differenceFormatted = computed(() => {
    return totalValue.value === 0
        ? '£--.--'
        : formatter.format(difference.value)
})

const differenceColor = computed(() => {
    return totalValue.value === 0
        ? 'opacity-20'
        : difference.value === 0
          ? 'text-green-500'
          : 'text-red-500'
})
</script>
