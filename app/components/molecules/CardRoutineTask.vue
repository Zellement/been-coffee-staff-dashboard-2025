<template>
    <transition name="fade">
        <loading-overlay v-if="loading" />
    </transition>
    <u-slideover
        v-model:open="open"
        :title="item.fields.task.fields.title"
        :description="
            item.fields.completedBy && item.fields.lastCompleted
                ? `Last completed by ${item.fields.completedBy} on ${fullDateConverter(item.fields.lastCompleted, true)}`
                : 'New task'
        "
    >
        <u-card
            class="cursor-pointer"
            :ui="{
                root: 'h-full flex w-full flex-col',
                body: 'flex flex-col h-full items-start'
            }"
            variant="subtle"
            :title="item.fields.task.fields.title"
        >
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
                    Overdue {{ inXDays(item.nextDueDate) }}
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
            <p class="">{{ item.fields.task.fields.title }}</p>

            <div class="mt-auto self-start">
                <u-field-group orientation="vertical" class="mt-auto pt-2">
                    <u-badge
                        v-if="item.fields.task?.fields?.staffLevel"
                        size="xs"
                        variant="outline"
                        trailing-icon="i-bx-bxs-arrow-to-top"
                        class="uppercase"
                        :label="item.fields.task.fields.staffLevel"
                    />
                    <u-badge
                        size="xs"
                        variant="outline"
                        class="font-semibold"
                        :label="`~ ${item.fields.task.fields.minutesToComplete} mins`"
                    />
                </u-field-group>
            </div>
        </u-card>
        <template #body>
            <div class="flex flex-col items-start gap-4 text-left">
                <div class="border-b pb-4">
                    <rich-text
                        v-if="item.fields.task.fields.description"
                        :content="item.fields.task.fields.description"
                    />
                </div>

                <div
                    v-if="
                        item.fields.task.fields.article &&
                        item.fields.task.fields.article.length
                    "
                >
                    <p class="uc-text mb-2 font-semibold">Related Articles:</p>

                    <u-button
                        v-for="article in item.fields.task.fields.article"
                        :key="article.sys.id"
                        :href="`/article/${article.fields.slug}`"
                        trailing-icon="i-material-symbols-arrow-right-alt"
                    >
                        {{ article.fields.title }}
                    </u-button>
                </div>

                <u-alert
                    v-if="item.fields.lastCompleted || item.fields.completedBy"
                    :title="`Due ${inXDays(item.nextDueDate)}`"
                    :ui="{
                        icon: '!size-5'
                    }"
                    variant="solid"
                    color="tertiary"
                />

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
                    v-if="item.fields.task?.fields?.staffLevel"
                    color="neutral"
                    title="Heads up!"
                    variant="outline"
                    :description="`Only completable by ${item.fields.task.fields.staffLevel}.`"
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

const { completeTask } = useContentfulUtils()

defineProps<Props>()

const { fullDateConverter, inXDays } = useDateUtils()

const handleCompleteTask = async (task: TypeDailyTask) => {
    loading.value = true
    await completeTask(task, 'routineTasks')
    loading.value = false
    open.value = false
}
</script>
