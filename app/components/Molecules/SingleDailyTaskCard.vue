<template>
    <u-card variant="solid" class="relative" :title="item.fields.title">
        <u-icon
            v-if="loading"
            class="absolute top-0 right-0 m-2"
            size="16"
            name="i-svg-spinners-blocks-shuffle-3"
        />
        <template #header>
            <template v-if="taskHasBeenCompletedTodayOrBefore">
                <u-badge size="sm" color="success" icon="i-bx-check">
                    Done
                </u-badge>
            </template>
            <template v-else>
                <u-badge
                    size="sm"
                    :variant="pastDueTime ? 'solid' : 'outline'"
                    :color="pastDueTime ? 'error' : 'neutral'"
                >
                    Due
                    {{ convertNumberTo24HrTime(item.fields.dueByHour) }}
                </u-badge>
            </template>
        </template>
        <u-slideover
            v-model:open="open"
            :title="item.fields.title"
            :description="`Last completed: ${item.fields.lastCompleted ? fullDateConverter(item.fields.lastCompleted, true) : 'Never'}`"
        >
            <p>{{ item.fields.title }}</p>
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
    item: TypeDailyTask
}

const open: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

const props = defineProps<Props>()

const { fullDateConverter, convertNumberTo24HrTime } = useDateUtils()
const { updateEntry } = useContentfulUtils()
const { fetchDailyTasks } = useDailyTasksUtils()

const today = new Date()
const currentHour = Number(today.getHours())

const taskHasBeenCompletedTodayOrBefore: ComputedRef<boolean> = computed(() => {
    const lastCompleted = props.item.fields.lastCompleted
    if (!lastCompleted) return false
    const lastCompletedDate = new Date(lastCompleted)
    return lastCompletedDate <= today
})

const pastDueTime: ComputedRef<boolean> = computed(() => {
    return currentHour >= Number(props.item.fields.dueByHour)
})

const toast = useToast()

var timezoneOffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
var localISOTime = new Date(Date.now() - timezoneOffset)
    .toISOString()
    .slice(0, -1)

const completeTask = async (task: TypeDailyTask) => {
    loading.value = true
    try {
        await updateEntry(task.sys.id, {
            fields: {
                lastCompleted: localISOTime
            }
        })
        toast.add({
            title: 'Task completed',
            description: `Task "${task.fields.title}" completed successfully!`,
            color: 'success'
        })
        open.value = false
        // Wait before refetching to allow Contentful to update
        setTimeout(() => {
            fetchDailyTasks()
            loading.value = false
        }, 2000)
    } catch (error) {
        toast.add({
            title: 'Error completing task',
            description: `Task "${task.fields.title}" could not be completed.`,
            color: 'error'
        })
        loading.value = false
        console.error('Error completing task', error)
    } finally {
    }
}
</script>
