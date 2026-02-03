<template>
    <transition name="fade">
        <loading-overlay v-if="loading" />
    </transition>
    <u-slideover
        v-model:open="open"
        :title="item.fields.title"
        :description="`Last completed: ${item.fields.lastCompleted ? fullDateConverter(item.fields.lastCompleted, true) : 'Never'} ${item.fields.completedBy ? `by ${item.fields.completedBy}` : ''}`"
    >
        <u-card
            class="cursor-pointer"
            variant="subtle"
            :title="item.fields.title"
        >
            <template v-if="taskHasBeenCompletedToday">
                <u-badge size="sm" color="success" icon="i-bx-check">
                    Done
                </u-badge>
            </template>
            <template v-else>
                <u-badge
                    size="sm"
                    :variant="pastDueTime ? 'solid' : 'outline'"
                    :color="pastDueTime ? 'error' : 'neutral'"
                    :class="pastDueTime ? 'animate-bounce' : ''"
                    icon="i-bx-time"
                >
                    Due
                    {{ convertNumberTo24HrTime(item.fields.time) }}
                </u-badge>
            </template>
            <p class="truncate">{{ item.fields.title }}</p>
            <u-field-group orientation="horizontal" class="mt-auto pt-2">
                <u-badge
                    :color="over24HoursAgo ? 'error' : 'primary'"
                    size="xs"
                    variant="outline"
                    icon="i-prime-history"
                >
                    {{
                        item.fields.lastCompleted
                            ? getMonthAndDayOnly(item.fields.lastCompleted)
                            : 'Never'
                    }}
                </u-badge>
                <u-badge
                    color="info"
                    :label="item.fields.day"
                    variant="outline"
                    size="xs"
                />
            </u-field-group>
        </u-card>
        <template #body>
            <div class="flex flex-col items-start">
                <rich-text
                    v-if="item.fields.description"
                    :content="item.fields.description"
                />
            </div>
        </template>
        <template #footer>
            <u-button
                v-if="!isGeneralLogin"
                :disabled="loading"
                class="ml-auto"
                :icon="
                    loading ? 'i-svg-spinners-blocks-shuffle-3' : 'i-bx-check'
                "
                color="tertiary"
                @click="handleCompleteTask(item)"
            >
                {{ loading ? 'Loading...' : 'Mark as complete' }}
            </u-button>
            <alert-logged-in-as-shop v-else />
        </template>
    </u-slideover>
</template>

<script lang="ts" setup>
interface Props {
    item: TypeTaskInstance
}

const userStore = useUserStore()

const isGeneralLogin: ComputedRef<boolean> = computed(() => {
    return userStore.isGeneralLogin
})

const open: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

const props = defineProps<Props>()

const { completeTask } = useContentfulUtils()
const { fullDateConverter, getMonthAndDayOnly, convertNumberTo24HrTime } =
    useDateUtils()

const today = new Date()
const currentHour = Number(today.getHours())

const taskHasBeenCompletedToday: ComputedRef<boolean> = computed(() => {
    const lastCompleted = props.item.fields.lastCompleted
    if (!lastCompleted) return false
    const lastCompletedDate = new Date(lastCompleted)
    return lastCompletedDate.toDateString() === today.toDateString()
})

const pastDueTime: ComputedRef<boolean> = computed(() => {
    return currentHour >= Number(props.item.fields.time)
})

const handleCompleteTask = async (task: TypeDailyTask) => {
    loading.value = true
    await completeTask(task, 'setDayTask')
    loading.value = false
    open.value = false
}

const over24HoursAgo = computed(() => {
    if (!props.item.fields.lastCompleted) return false
    const lastCompletedDate = new Date(props.item.fields.lastCompleted)
    const now = new Date()
    const diffInMs = now.getTime() - lastCompletedDate.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    return diffInHours > 24
})
</script>
