<template>
    <u-card variant="solid" :title="item.fields.title">
        <template #header>
            <template v-if="taskHasBeenCompletedTodayOrBefore">
                <u-badge color="success" icon="i-bx-check">Done</u-badge>
            </template>
            <template v-else>
                <u-badge
                    :variant="pastDueTime ? 'solid' : 'outline'"
                    :color="pastDueTime ? 'error' : 'neutral'"
                >
                    Due
                    {{ convertNumberTo24HrTime(item.fields.dueByHour) }}
                </u-badge>
            </template>
        </template>
        <u-slideover
            :title="item.fields.title"
            :description="`Last completed: ${fullDateConverter(item.fields.lastCompleted, true) || 'Never'}`"
        >
            {{ taskHasBeenCompletedTodayOrBefore }}
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
                <u-button class="ml-auto" @click="completeTask(item)">
                    Mark as complete
                </u-button>
            </template>
        </u-slideover>
    </u-card>
</template>

<script lang="ts" setup>
interface Props {
    item: TypeDailyTask
}

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
    try {
        const result = await updateEntry(task.sys.id, {
            fields: {
                lastCompleted: localISOTime
            }
        })
        toast.add({
            title: 'Task completed',
            description: `Task "${task.fields.title}" completed successfully!`
        })
        // Wait before refetching to allow Contentful to update
        setTimeout(() => {
            fetchDailyTasks()
        }, 2000)
        console.log('Task completed successfully', result)
    } catch (error) {
        console.error('Error completing task', error)
    }
}
</script>
