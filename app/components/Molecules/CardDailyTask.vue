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
        :title="item.fields.task.fields.title"
        :description="`Last completed: ${item.fields.lastCompleted ? fullDateConverter(item.fields.lastCompleted, true) : 'Never'}`"
    >
        <u-card variant="task" :title="item.fields.task.fields.title">
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
                    icon="i-bx-time"
                >
                    Due
                    {{
                        convertNumberTo24HrTime(
                            item.fields.task.fields.dueByHour
                        )
                    }}
                </u-badge>
            </template>
            <p>{{ item.fields.task.fields.title }}</p>
        </u-card>
        <template #body>
            <div class="flex flex-col items-start">
                <rich-text
                    v-if="item.fields.task.fields.description"
                    :content="item.fields.task.fields.description"
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
const { fullDateConverter, convertNumberTo24HrTime } = useDateUtils()

const today = new Date()
const currentHour = Number(today.getHours())

const taskHasBeenCompletedToday: ComputedRef<boolean> = computed(() => {
    const lastCompleted = props.item.fields.lastCompleted
    if (!lastCompleted) return false
    const lastCompletedDate = new Date(lastCompleted)
    return lastCompletedDate.toDateString() === today.toDateString()
})

const pastDueTime: ComputedRef<boolean> = computed(() => {
    return currentHour >= Number(props.item.fields.task.fields.dueByHour)
})

const handleCompleteTask = async (task: TypeDailyTask) => {
    loading.value = true
    await completeTask(task)
    loading.value = false
    open.value = false
}
</script>
