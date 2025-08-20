<template>
    <div class="page p-20">
        <h1 class="mb-20 text-2xl">Routine tasks</h1>
        <div v-if="allRoutineTasks">
            <u-carousel
                v-slot="{ item }"
                :items="allRoutineTasks"
                :ui="{ item: 'basis-1/3' }"
            >
                <div>
                    <u-card :title="item.fields.title">
                        <p>{{ item.fields.title }}</p>
                        <p>
                            Last completed:
                            {{ item.fields.lastCompleted || 'Never' }}
                        </p>
                        <u-button @click="completeTask(item)">
                            Complete
                        </u-button>
                    </u-card>
                </div>
            </u-carousel>
            <!-- <ul>
                <li v-for="task in allRoutineTasks" :key="task.sys.id">
                    {{ task.fields.title }}
                    <button @click="completeTask(task)">Complete me</button>
                </li>
            </ul> -->
        </div>
    </div>
</template>

<script setup lang="ts">
const allRoutineTasks: Ref<TypeRoutineTask[] | null> = ref(null)

const { fetchEntries, updateEntry } = useContentfulUtils()

const routineTasksFetch = await fetchEntries({ content_type: 'routineTask' })
allRoutineTasks.value = routineTasksFetch?.items

const toast = useToast()

var timezoneOffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
var localISOTime = new Date(Date.now() - timezoneOffset)
    .toISOString()
    .slice(0, -1)

const completeTask = async (task: TypeRoutineTask) => {
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
        console.log('Task completed successfully', result)
    } catch (error) {
        console.error('Error completing task', error)
    }
}
</script>
