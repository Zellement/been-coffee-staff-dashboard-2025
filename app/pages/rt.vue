<template>
    <div class="page p-20">
        <h1 class="mb-20 text-2xl">Routine tasks</h1>
        <div v-if="allRoutineTasks">
            <ul>
                <li v-for="task in allRoutineTasks" :key="task.sys.id">
                    {{ task.fields.title }}
                    <button @click="completeTask(task)">Complete me</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const allRoutineTasks: Ref<TypeRoutineTask[] | null> = ref(null)

const { fetchEntries, updateEntry } = useContentfulUtils()

const routineTasksFetch = await fetchEntries({ content_type: 'routineTask' })
allRoutineTasks.value = routineTasksFetch?.items

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
        console.log('Task completed successfully', result)
    } catch (error) {
        console.error('Error completing task', error)
    }
}
</script>
