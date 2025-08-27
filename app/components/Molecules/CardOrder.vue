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
                        {{
                            shortDateConverter(item.fields.expectedDeliveryDate)
                        }}
                    </u-badge>
                    yo yo
                </template>
                <p>{{ item.fields.supplier.fields.title }}</p>
            </button>
            <template #body>
                <div class="flex flex-col items-start">
                    <div class="whitespace-pre-line">
                        {{ item.fields.details }}
                    </div>
                </div>
            </template>
            <!-- <template #footer>
                <u-button
                    v-if="!isGeneralLogin"
                    :disabled="loading"
                    class="ml-auto"
                    :icon="
                        loading
                            ? 'i-svg-spinners-blocks-shuffle-3'
                            : 'i-bx-check'
                    "
                    @click="handleCompleteTask(item)"
                >
                    {{ loading ? 'Loading...' : 'Mark as complete' }}
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
            </template> -->
        </u-slideover>
    </u-card>
</template>

<script lang="ts" setup>
interface Props {
    item: TypeOrder
}

// const userStore = useUserStore()

// const isGeneralLogin: ComputedRef<boolean> = computed(() => {
//     return userStore.isGeneralLogin
// })

const open: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

const props = defineProps<Props>()

// const { completeTask } = useContentfulUtils()
const { fullDateConverter, shortDateConverter } = useDateUtils()

// const today = new Date()
// const currentHour = Number(today.getHours())

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

// const pastDueTime: ComputedRef<boolean> = computed(() => {
//     return currentHour >= Number(props.item.fields.task.fields.dueByHour)
// })

// const handleCompleteTask = async (task: TypeDailyTask) => {
//     loading.value = true
//     await completeTask(task)
//     loading.value = false
//     open.value = false
// }
</script>
