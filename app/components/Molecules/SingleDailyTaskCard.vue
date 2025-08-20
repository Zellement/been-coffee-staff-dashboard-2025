<template>
    <u-card variant="solid" :title="item.fields.title">
        <template #header>
            <u-badge>Due</u-badge>
        </template>
        <u-slideover
            :title="item.fields.title"
            :description="`Last completed: ${fullDateConverter(item.fields.lastCompleted, true) || 'Never'}`"
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

const { fullDateConverter } = useDateUtils()
const { updateEntry } = useContentfulUtils()
const { fetchDailyTasks } = useDailyTasksUtils()

defineProps<Props>()

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
