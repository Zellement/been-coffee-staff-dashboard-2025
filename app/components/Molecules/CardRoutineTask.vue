<template>
    <transition name="fade">
        <div
            v-if="loading"
            class="dark:bg-navy-500/50 absolute inset-0 z-10 flex bg-white/50"
        >
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
        :description="`Last completed: ${item.lastCompletedDate ? fullDateConverter(item.lastCompletedDate) : 'Never'}`"
    >
        <u-card variant="task" :title="item.fields.task.fields.title">
            <u-badge
                v-if="item.fields.task?.fields?.staffLevel?.fields"
                class="absolute top-1 right-1"
                size="xs"
                color="neutral"
                variant="outline"
                trailing-icon="i-bx-bxs-arrow-to-top"
            >
                {{ item.fields.task.fields.staffLevel.fields.title }}
            </u-badge>
            <template v-if="item.type === 'upcoming'">
                <u-badge
                    size="sm"
                    color="neutral"
                    variant="outline"
                    icon="i-bx-hourglass"
                >
                    Due
                    <span>{{ inXDays(item.nextDueDate) }}</span>
                </u-badge>
            </template>
            <template v-else-if="item.type === 'overdue'">
                <u-badge
                    size="sm"
                    color="error"
                    icon="i-bx-error"
                    class="animate-bounce"
                >
                    Overdue
                </u-badge>
            </template>
            <template v-else-if="item.type === 'new'">
                <u-badge
                    size="sm"
                    color="warning"
                    icon="i-bx-badge"
                    class="animate-bounce"
                >
                    New
                </u-badge>
            </template>
            <p>{{ item.fields.task.fields.title }}</p>
        </u-card>
        <template #body>
            <div class="flex flex-col items-start gap-4 text-left">
                <div class="border-b pb-4">
                    <rich-text
                        v-if="item.fields.task.fields.description"
                        :content="item.fields.task.fields.description"
                    />
                </div>
                <div class="flex w-full gap-2 text-center">
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">Minutes to complete:</p>
                        <div class="font-semibold">
                            {{ item.fields.task.fields.minutesToComplete }}
                        </div>
                    </u-card>
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">Frequency:</p>
                        <div class="font-semibold">
                            {{ item.fields.task.fields.frequencyInDays }}
                            days
                        </div>
                    </u-card>
                </div>

                <u-alert
                    v-if="item.fields.task?.fields?.staffLevel?.fields"
                    color="neutral"
                    title="Heads up!"
                    variant="outline"
                    :description="`Only a ${item.fields.task.fields.staffLevel.fields.title} or a more senior member of the team (if applicable) should complete this task.`"
                    icon="i-basil-info-circle-outline"
                    :ui="{
                        icon: '!size-6'
                    }"
                />
            </div>
        </template>
        <template #footer>
            <u-button
                v-if="!isGeneralLogin"
                :disabled="loading"
                class="ml-auto"
                color="tertiary"
                :icon="
                    loading ? 'i-svg-spinners-blocks-shuffle-3' : 'i-bx-check'
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

const { completeTask } = useContentfulUtils()

defineProps<Props>()

const { fullDateConverter, inXDays } = useDateUtils()

const handleCompleteTask = async (task: TypeDailyTask) => {
    loading.value = true
    await completeTask(task)
    loading.value = false
    open.value = false
}
</script>
