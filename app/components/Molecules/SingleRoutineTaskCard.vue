<template>
    <u-card
        variant="solid"
        class="relative"
        :title="item.fields.task.fields.title"
    >
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
            <button class="flex flex-col items-start gap-1 text-left">
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
                        <span>{{ shortDateConverter(item.nextDueDate) }}</span>
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
            </button>
            <template #body>
                <div class="flex flex-col items-start gap-4 text-left">
                    <div class="border-b pb-4">
                        <rich-text
                            v-if="item.fields.task.fields.description"
                            :content="item.fields.task.fields.description"
                        />
                    </div>
                    <div class="flex w-full gap-2 text-center">
                        <u-card variant="soft" class="flex flex-1 flex-col">
                            <div>Minutes to complete:</div>
                            <div class="font-semibold">
                                {{ item.fields.task.fields.minutesToComplete }}
                            </div>
                        </u-card>
                        <u-card variant="soft" class="flex flex-1 flex-col">
                            <div>Frequency:</div>
                            <div class="font-semibold">
                                {{ item.fields.task.fields.frequencyInDays }}
                                days
                            </div>
                        </u-card>
                    </div>

                    <UAlert
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
                    :disabled="loading"
                    class="ml-auto"
                    :icon="
                        loading
                            ? 'i-svg-spinners-blocks-shuffle-3'
                            : 'i-bx-check'
                    "
                    @click="completeTask(item)"
                >
                    {{ loading ? 'Loading...' : 'Mark as complete' }}
                </u-button>
            </template>
        </u-slideover>
    </u-card>
</template>

<script lang="ts" setup>
interface Props {
    item: TypeTaskInstance
}

const open: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

defineProps<Props>()

const { fullDateConverter, shortDateConverter } = useDateUtils()

const toast = useToast()

var timezoneOffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
var localISOTime = new Date(Date.now() - timezoneOffset)
    .toISOString()
    .slice(0, -1)

const completeTask = async (task: TypeDailyTask) => {
    loading.value = true
    try {
        await $fetch(`/api/contentful/update-entry`, {
            method: 'POST',
            body: {
                id: task.sys.id,
                fields: {
                    lastCompleted: localISOTime
                }
            }
        })
        toast.add({
            title: 'Task completed',
            color: 'success',
            icon: 'i-bx-check'
        })
        open.value = false
        // Wait before refetching to allow Contentful to update
        setTimeout(() => {
            loading.value = false
            refreshNuxtData()
        }, 2000)
    } catch (error) {
        toast.add({
            title: 'Error completing task',
            description: `Task "${task.fields.task.fields.title}" could not be completed.`,
            color: 'error'
        })
        loading.value = false
        console.error('Error completing task', error)
    } finally {
    }
}
</script>
