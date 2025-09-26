<template>
    <div class="border-seashell-600 dark:border-navy-300 border-b pb-8">
        <div
            class="sticky top-0 mb-6 grid grid-cols-6 justify-between gap-2 py-1.5"
        >
            <div class="col-span-3 flex flex-row gap-3 self-end md:col-span-4">
                <div class="flex w-4 self-stretch" :class="style" />
                <div class="flex flex-col">
                    <p>{{ titleBrow }}</p>
                    <h3 class="uc-text !m-0">{{ title }}</h3>
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
                :key="`black-tin__${denomination.denomination}`"
                class="grid grid-cols-12 items-center"
            >
                <span class="col-span-2">{{ denomination.denomination }}</span>

                <!-- VALUE input -->
                <div class="relative col-span-5 flex items-center gap-1">
                    <div>£</div>
                    <u-input
                        :model-value="toPounds(denomination.valueP)"
                        type="number"
                        :step="toPounds(denomination.multipleP)"
                        :min="0"
                        class="w-full pr-4"
                        :name="`${collection} ${denomination.denomination} value`"
                        @update:model-value="
                            (val) =>
                                syncFromValuePounds(
                                    denomination,
                                    Number(val) || 0
                                )
                        "
                    />
                </div>

                <!-- COUNT input -->
                <u-input
                    v-model.number="denomination.count"
                    type="number"
                    :step="1"
                    :min="0"
                    class="col-span-5"
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

// helpers
const toPence = (pounds: number) => Math.round(pounds * 100)
const toPounds = (pence: number) => +(pence / 100).toFixed(2)
const formatCurrency = (val: number): string => {
    return val === 0
        ? '£--.--'
        : new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP'
          }).format(toPounds(val))
}

// types
interface Denomination {
    denomination: string
    multipleP: number // in pence
    count: number
    valueP: number // total value in pence
}

// data
const state = reactive<{ denominations: Denomination[] }>({
    denominations: [
        { denomination: '£20', multipleP: 2000, count: 0, valueP: 0 },
        { denomination: '£10', multipleP: 1000, count: 0, valueP: 0 },
        { denomination: '£5', multipleP: 500, count: 0, valueP: 0 },
        { denomination: '£2', multipleP: 200, count: 0, valueP: 0 },
        { denomination: '£1', multipleP: 100, count: 0, valueP: 0 },
        { denomination: '50p', multipleP: 50, count: 0, valueP: 0 },
        { denomination: '20p', multipleP: 20, count: 0, valueP: 0 },
        { denomination: '10p', multipleP: 10, count: 0, valueP: 0 },
        { denomination: '5p', multipleP: 5, count: 0, valueP: 0 },
        { denomination: '2p', multipleP: 2, count: 0, valueP: 0 },
        { denomination: '1p', multipleP: 1, count: 0, valueP: 0 }
    ]
})

// sync functions
const syncFromCount = (denom: Denomination) => {
    denom.count = Math.max(0, Math.round(denom.count))
    denom.valueP = denom.count * denom.multipleP
}

const syncFromValuePounds = (denom: Denomination, pounds: number) => {
    const p = Math.max(0, toPence(pounds))
    const count = Math.round(p / denom.multipleP)
    denom.count = count
    denom.valueP = count * denom.multipleP
}

// totals
const totalP = computed(() =>
    state.denominations.reduce((a, d) => a + d.valueP, 0)
)
const totalValueFormatted = computed(() => formatCurrency(totalP.value))

// ⬇️ Restore your original difference = total - 100 (which means £100.00)
const FLOAT_TARGET_P = 100 * 100 // 100 pounds = 10,000 pence

const differenceP = computed(() => totalP.value - FLOAT_TARGET_P)
const differenceFormatted = computed(() =>
    formatCurrency(totalP.value === 0 ? 0 : differenceP.value)
)

// colors
const totalColor = computed<string | null>(() =>
    totalP.value === 0 ? 'opacity-20' : null
)

const differenceColor = computed<string>(() => {
    if (totalP.value === 0) return 'opacity-20'
    if (differenceP.value === 0) return 'text-green-500'
    return 'text-red-500'
})
</script>
