<template>
    <transition name="fade">
        <div v-if="loading" class="absolute inset-0 z-30 flex bg-white/80">
            <u-icon
                class="m-auto"
                size="16"
                name="i-svg-spinners-blocks-shuffle-3"
            />
        </div>
    </transition>
    <u-slideover
        v-model:open="open"
        :title="item.fields.supplier.fields.title"
        :description="`Ordered: ${item.fields.orderDate ? fullDateConverter(item.fields.orderDate, false) : 'Unknown'}`"
    >
        <u-card
            variant="subtle"
            class="relative"
            :title="item.fields.supplier.fields.title"
            :description="fullDateConverter(item.fields.orderDate)"
        >
            <template v-if="orderHasBeenChecked">
                <u-badge
                    size="sm"
                    color="neutral"
                    variant="solid"
                    icon="i-ic-baseline-move-to-inbox"
                    trailing-icon="i-bx-check"
                >
                    Checked
                </u-badge>
            </template>
            <template v-else>
                <u-badge
                    size="sm"
                    :color="badgeStyle.colour"
                    :variant="badgeStyle.variant"
                    icon="i-bx-time"
                >
                    Due
                    {{ inXDays(item.fields.expectedDeliveryDate) }}
                </u-badge>
            </template>
            <nuxt-img
                class="mt-2 h-5 w-auto max-w-full rounded bg-white p-0.5"
                :src="`${item.fields.supplier.fields.logo?.fields?.file?.url}?h=12&fm=webp`"
                :alt="item.fields.supplier.fields.title"
            />
        </u-card>
        <template #body>
            <div class="flex flex-col items-start gap-8">
                <div
                    v-if="item.fields.details"
                    class="mb-4 w-full pb-4 whitespace-pre-line"
                >
                    {{ item.fields.details }}
                </div>
                <div v-else>Usual order from this supplier.</div>
                <div class="grid w-full grid-cols-2 gap-2 text-center">
                    <u-card
                        variant="outline"
                        class="flex items-center justify-center gap-8 text-center"
                    >
                        <p class="uc-text">
                            {{ item.fields.supplier.fields.title }}
                        </p>
                        <div
                            class="m-auto mt-2 self-center overflow-hidden rounded-md bg-white"
                        >
                            <nuxt-img
                                class="m-auto h-4 w-auto max-w-full"
                                :src="`${item.fields.supplier.fields.logo?.fields?.file?.url}?h=12&fm=webp`"
                                :alt="item.fields.supplier.fields.title"
                            />
                        </div>
                    </u-card>
                    <u-card
                        variant="outline"
                        class="flex items-center justify-center gap-8"
                    >
                        <p class="uc-text">Ordered by:</p>
                        <div class="">
                            <img
                                class="border-butterscotch-500 mx-auto rounded-full border-2 object-cover"
                                :src="`${
                                    item.fields?.orderedBy?.fields?.photo?.[0]
                                        ?.fields?.file?.url
                                }?w=50&h=50&fit=fill&f=face&fm=webp`"
                                :alt="item.fields.orderedBy?.fields?.name"
                            />
                        </div>
                    </u-card>
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">Order date:</p>
                        <div class="font-semibold">
                            {{ fullDateConverter(item.fields.orderDate) }}
                        </div>
                    </u-card>
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">Expected delivery date:</p>
                        <div class="font-semibold">
                            {{
                                fullDateConverter(
                                    item.fields.expectedDeliveryDate
                                )
                            }}
                        </div>
                    </u-card>
                </div>
                <div
                    v-if="
                        item.fields.deliveryCheckedBy ||
                        item.fields.deliveryCheckedAt
                    "
                    class="grid w-full grid-cols-2 gap-2 text-center"
                >
                    <u-card
                        v-if="item.fields.deliveryCheckedBy"
                        class="flex flex-1 flex-col"
                    >
                        <p class="uc-text">Checked by:</p>
                        <div class="font-semibold">
                            {{ item.fields.deliveryCheckedBy }}
                        </div>
                    </u-card>
                    <u-card
                        v-if="item.fields.deliveryCheckedAt"
                        class="flex flex-1 flex-col"
                    >
                        <p class="uc-text">Checked at:</p>
                        <div class="font-semibold">
                            {{
                                fullDateConverter(
                                    item.fields.deliveryCheckedAt,
                                    true
                                )
                            }}
                        </div>
                    </u-card>
                </div>
            </div>
        </template>
        <template #footer>
            <div v-if="!isGeneralLogin" class="flex flex-col gap-2">
                <u-alert
                    variant="outline"
                    color="warning"
                    title="Issue with this order?"
                    description="If there is something wrong with this order, please contact your manager before approving this order."
                />
                <u-textarea
                    v-model="feedback"
                    placeholder="Any notes for this order?"
                    color="neutral"
                    variant="outline"
                    name="feedback"
                />
                <u-button
                    :disabled="loading"
                    class="ml-auto"
                    color="tertiary"
                    :icon="
                        loading
                            ? 'i-svg-spinners-blocks-shuffle-3'
                            : 'i-bx-check'
                    "
                    @click="handleCheckedOrder(item)"
                >
                    {{ loading ? 'Loading...' : 'Mark as received & checked' }}
                </u-button>
            </div>
            <u-alert
                v-else
                variant="outline"
                color="neutral"
                icon="i-basil-info-circle-outline"
                :ui="{
                    icon: '!size-6'
                }"
                description="You are logged in as a shop so task completion is disabled."
            />
        </template>
    </u-slideover>
</template>

<script lang="ts" setup>
interface Props {
    item: TypeOrder
}

const userStore = useUserStore()

const isGeneralLogin: ComputedRef<boolean> = computed(() => {
    return userStore.isGeneralLogin
})

const open: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

const props = defineProps<Props>()

const feedback: Ref<string> = ref(props.item.fields.feedback || '')

const { checkedOrder } = useContentfulUtils()
const { fullDateConverter, inXDays } = useDateUtils()

const orderHasBeenChecked: ComputedRef<boolean> = computed(() => {
    return (
        props.item.fields.deliveryCheckedAt &&
        props.item.fields.deliveryCheckedBy
    )
})

const badgeStyle: ComputedRef<{
    colour: 'error' | 'neutral' | 'warning'
    variant: 'solid' | 'outline'
}> = computed(() => {
    const expectedDate = new Date(props.item.fields.expectedDeliveryDate)
    const now = new Date()
    if (now.getDate() > expectedDate.getDate()) {
        return { colour: 'error', variant: 'solid' }
    }
    if (now.getDate() === expectedDate.getDate()) {
        return { colour: 'warning', variant: 'solid' }
    }
    return { colour: 'neutral', variant: 'outline' }
})

const handleCheckedOrder = async (task: TypeDailyTask) => {
    loading.value = true
    await checkedOrder(task, feedback.value)
    loading.value = false
    open.value = false
}
</script>
