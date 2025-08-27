<template>
    <u-card
        variant="solid"
        class="relative"
        :title="item.fields.supplier.fields.title"
        :description="fullDateConverter(item.fields.orderDate)"
    >
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
            <button class="flex flex-col items-start gap-1">
                <template v-if="orderHasBeenChecked">
                    <u-badge size="sm" color="success" icon="i-bx-check">
                        Done
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
                    class="mt-2 h-6"
                    :src="item.fields.supplier.fields.logo?.fields?.file?.url"
                    :alt="item.fields.supplier.fields.title"
                />
            </button>
            <template #body>
                <div class="flex flex-col items-start">
                    <div class="mb-4 w-full border-b pb-4 whitespace-pre-line">
                        {{ item.fields.details }}
                    </div>
                    <div class="grid w-full grid-cols-2 gap-2 text-center">
                        <u-card
                            variant="soft"
                            class="flex items-center justify-center gap-8"
                        >
                            <div class="m-auto">
                                <img
                                    height="30"
                                    class="h-[30px]"
                                    :src="`${
                                        item.fields?.supplier?.fields?.logo
                                            ?.fields?.file?.url
                                    }?h=60&fit=fill&fm=webp`"
                                    :alt="item.fields.supplier.fields.title"
                                />
                            </div>
                        </u-card>
                        <u-card
                            variant="soft"
                            class="flex items-center justify-center gap-8"
                        >
                            <div>Ordered by:</div>
                            <div class="font-semibold">
                                <img
                                    class="border-butterscotch-500 mx-auto rounded-full border-2 object-cover"
                                    :src="`${
                                        item.fields?.orderedBy?.fields
                                            ?.photo?.[0]?.fields?.file?.url
                                    }?w=50&h=50&fit=fill&f=face&fm=webp`"
                                    :alt="item.fields.orderedBy?.fields?.name"
                                />
                            </div>
                        </u-card>
                        <u-card variant="soft" class="flex flex-1 flex-col">
                            <div>Order date:</div>
                            <div class="font-semibold">
                                {{ fullDateConverter(item.fields.orderDate) }}
                            </div>
                        </u-card>
                        <u-card variant="soft" class="flex flex-1 flex-col">
                            <div>Expected delivery date:</div>
                            <div class="font-semibold">
                                {{
                                    fullDateConverter(
                                        item.fields.expectedDeliveryDate
                                    )
                                }}
                            </div>
                        </u-card>
                    </div>
                </div>
            </template>
            <template #footer>
                <u-button
                    v-if="!isGeneralLogin"
                    :disabled="loading"
                    class="ml-auto"
                    :icon="
                        loading
                            ? 'i-svg-spinners-blocks-shuffle-3'
                            : 'i-bx-check'
                    "
                    @click="handleCheckedOrder(item)"
                >
                    {{ loading ? 'Loading...' : 'Mark as received & checked' }}
                </u-button>
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
    </u-card>
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

const { checkedOrder } = useContentfulUtils()
const { fullDateConverter, inXDays } = useDateUtils()

const orderHasBeenChecked: ComputedRef<boolean> = computed(() => {
    return props.item.deliveryCheckedAt
})

const badgeStyle: ComputedRef<{
    colour: 'error' | 'neutral'
    variant: 'solid' | 'outline'
}> = computed(() => {
    const expectedDate = new Date(props.item.fields.expectedDeliveryDate)
    const now = new Date()
    return now > expectedDate
        ? { colour: 'error', variant: 'solid' }
        : { colour: 'neutral', variant: 'outline' }
})

const handleCheckedOrder = async (task: TypeDailyTask) => {
    loading.value = true
    await checkedOrder(task)
    loading.value = false
    open.value = false
}
</script>
