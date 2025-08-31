<template>
    <div class="p-default">
        <h1 class="uc-text mb-8">Daily Temperature Logs</h1>

        <div v-if="state.hasSent" class="flex flex-col items-start gap-2">
            <u-alert
                color="success"
                title="Success"
                description="Your temperature logs have been submitted successfully. Please check the log has been updated correctly."
            />
            <u-button
                to="https://docs.google.com/spreadsheets/d/1Bh5vjjW7wU8HaMsP7-R0M0XTlx1Ohd9uh25AK3ZZrIY/edit#gid=0"
                target="_blank"
                color="tertiary"
            >
                View temperature logs
            </u-button>
            <p class="mt-12 text-xs">
                To see the form again, please refresh this page.
            </p>
        </div>
        <u-alert
            v-if="state.hasErrored"
            color="error"
            title="Error"
            description="There was an error submitting your temperature logs.  Please let Dan know
                    pronto. To see the form again, please refresh this page."
            icon="noto:skull-and-crossbones"
        />

        <form
            v-if="!state.isSending && !state.hasSent && !state.hasErrored"
            id="daily-temperature-logs"
            ref="dailyTemperatureLogs"
            class="flex flex-col gap-6"
            name="daily-temperature-logs"
            @submit.prevent="submitToGoogleSheets"
        >
            <shift-leads />

            <ul>
                <li>Freezers: -18&deg;C or lower</li>
                <li>Fridges: 1&deg;C - 7&deg;C</li>
            </ul>

            <h2 class="uc-text">Bar Area</h2>
            <temperature-log-input
                v-for="item in temperatureLoggingItemsBar"
                :key="item.id"
                :item="item.key"
                :plus-or-minus="item.value"
            />
            <h2 class="uc-text">Back of House</h2>
            <temperature-log-input
                v-for="item in temperatureLoggingItemsBack"
                :key="item.id"
                :item="item.key"
                :plus-or-minus="item.value"
            />

            <u-textarea
                placeholder="Notes and comments"
                name="Comments"
                variant="outline"
            />

            <u-button type="submit" class="self-end" color="tertiary">
                Submit temperatures
            </u-button>
        </form>
        <div v-else-if="state.isSending" class="">Sending, please wait...</div>
    </div>
</template>
<script lang="ts" setup>
const locationsStore = useLocationsStore()

const { completeTask } = useContentfulUtils()
const toast = useToast()

const task: Ref<TypeTaskInstance | null> = ref(null)
const dailyTemperatureLogs = ref()

const state = reactive({
    isSending: false,
    hasSent: false,
    hasErrored: false
})

const activeLocation: ComputedRef<TypeLocation | undefined> = computed(() => {
    return locationsStore.activeLocation
})

const temperatureLoggingItemsBar: ComputedRef<TemperatureRepeaterItem[]> =
    computed(() => {
        return activeLocation.value?.fields?.temperatureLoggingItemsBar ?? []
    })

const temperatureLoggingItemsBack: ComputedRef<TemperatureRepeaterItem[]> =
    computed(() => {
        return activeLocation.value?.fields?.temperatureLoggingItemsBack ?? []
    })

const scriptURL: ComputedRef<string> = computed(() => {
    return activeLocation.value.fields.googleSheetsScriptTemperatureLogs || ''
})

onMounted(async () => {
    try {
        const params = {
            content_type: 'taskInstance',
            'fields.location.sys.id': activeLocation.value?.sys?.id,
            'fields.task.sys.contentType.sys.id': 'dailyTask',
            'fields.task.fields.title': 'Temperature Logs'
        }
        const data = await $fetch('/api/contentful/fetch-entries', { params })
        if (data?.items?.length) {
            task.value = data.items[0] || null
        }
    } catch (error) {
        console.error('Error fetching task instance:', error)
    }
})

const submitToGoogleSheets = async () => {
    const formData = new FormData(dailyTemperatureLogs.value)
    for (const [key, value] of formData.entries()) {
        console.log(key, value)
    }
    state.isSending = true
    state.hasSent = false
    state.hasErrored = false
    try {
        if (!scriptURL.value || typeof scriptURL.value !== 'string') {
            toast.add({ title: 'Google Sheets script URL is not defined.' })
            throw new Error('Google Sheets script URL is not defined.')
        }
        const response: any = await fetch(scriptURL.value, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            toast.add({ title: 'Error sending data to Google Sheets.' })
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (task.value) {
            await completeTask(task.value)
        }

        state.hasSent = true
    } catch (error: any) {
        state.isSending = false
        state.hasErrored = true
        console.error('Error!', error?.message || error)
    } finally {
        state.isSending = false
    }
}

useHead({
    title: 'Daily Temperature Logs'
})
</script>
