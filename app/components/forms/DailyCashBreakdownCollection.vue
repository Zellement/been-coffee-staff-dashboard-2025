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
                    v-if="props.collection !== 'Banking'"
                    class="denominations-end transform-all mt-auto flex flex-col justify-between self-end leading-none duration-300"
                >
                    <span class="text-2xs text-right">
                        <Icon
                            name="mdi:plus-minus-variant"
                            class="flex h-3 w-3"
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

        <div class="flex flex-col gap-2">
            <div class="grid grid-cols-12 items-center">
                <span class="col-span-2 font-bold">Cash</span>
                <span class="col-span-5 font-bold">Value</span>
                <span class="col-span-5 font-bold">Count</span>
            </div>
            <div
                v-for="denomination in state.denominations"
                :key="`black-tin__${denomination}`"
                class="grid grid-cols-12 items-center"
            >
                <span class="col-span-2">{{ denomination.denomination }}</span>

                <div class="relative col-span-5 flex items-center gap-1">
                    <div>£</div>
                    <u-input
                        v-model.number="denomination.value"
                        type="number"
                        step="0.01"
                        class="w-full pr-4"
                        :name="`${collection} ${denomination.denomination} value`"
                        @input="syncFromValue(denomination)"
                    />
                </div>
                <u-input
                    v-model.number="denomination.count"
                    class="col-span-5"
                    type="number"
                    step="1"
                    :name="`${collection} ${denomination.denomination} count`"
                    @input="syncFromCount(denomination)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

interface Props {
    collection: string
    collectionBrow?: string | null
    collectionStyle: string
}

const props = defineProps<Props>()

const title = computed(() => props.collection)
const titleBrow = computed(() => props.collectionBrow)
const style = computed(() => props.collectionStyle)

const formatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP'
})

interface Denomination {
    denomination: string
    multiple: number
    count: number
    value: number
}

const state = reactive<{
    denominations: Denomination[]
}>({
    denominations: [
        { denomination: '£20', multiple: 20, count: 0, value: 0 },
        { denomination: '£10', multiple: 10, count: 0, value: 0 },
        { denomination: '£5', multiple: 5, count: 0, value: 0 },
        { denomination: '£2', multiple: 2, count: 0, value: 0 },
        { denomination: '£1', multiple: 1, count: 0, value: 0 },
        { denomination: '50p', multiple: 0.5, count: 0, value: 0 },
        { denomination: '20p', multiple: 0.2, count: 0, value: 0 },
        { denomination: '10p', multiple: 0.1, count: 0, value: 0 },
        { denomination: '5p', multiple: 0.05, count: 0, value: 0 },
        { denomination: '2p', multiple: 0.02, count: 0, value: 0 },
        { denomination: '1p', multiple: 0.01, count: 0, value: 0 }
    ]
})

const syncFromCount = (denom: Denomination) => {
    denom.value = denom.count * denom.multiple
}

const syncFromValue = (denom: Denomination) => {
    denom.count = denom.multiple > 0 ? denom.value / denom.multiple : 0
}

const formatCurrency = (val: number): string => {
    return val === 0 ? '£--.--' : formatter.format(val)
}

const totalValue = computed<number>(() =>
    state.denominations.reduce((acc, d) => acc + d.value, 0)
)

const totalValueFormatted = computed<string>(() =>
    formatCurrency(totalValue.value)
)

const difference = computed<number>(() => totalValue.value - 100)

const differenceFormatted = computed<string>(() =>
    formatCurrency(totalValue.value === 0 ? 0 : difference.value)
)

const totalColor = computed<string | null>(() =>
    totalValue.value === 0 ? 'opacity-20' : null
)

const differenceColor = computed<string>(() => {
    if (totalValue.value === 0) return 'opacity-20'
    if (difference.value === 0) return 'text-green-500'
    return 'text-red-500'
})
</script>
