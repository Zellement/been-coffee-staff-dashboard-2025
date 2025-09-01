<template>
    <div class="p-default">
        <h1 class="uc-text mb-8">Daily Cash Breakdown</h1>

        <u-alert
            v-if="state.hasSent"
            color="success"
            title="Success"
            description="Your cash breakdown has been submitted successfully."
            :actions="[
                {
                    label: 'Go home',
                    color: 'neutral',
                    variant: 'subtle',
                    to: '/'
                }
            ]"
        />
        <u-alert
            v-else-if="state.hasErrored"
            color="error"
            title="Error"
            description="There was an error submitting your cash breakdown.  Please let Dan know
                    pronto. To see the form again, please refresh this page."
            icon="noto:skull-and-crossbones"
        />

        <form
            v-if="!state.isSending && !state.hasSent && !state.hasErrored"
            id="daily-cash-breakdown"
            ref="dailyCashBreakdown"
            class="flex flex-col gap-6"
            name="daily-cash-breakdown"
            @submit.prevent="submitToGoogleSheets"
        >
            <shift-leads />

            <div>
                <h2 class="uc-text">Waste</h2>
                <p class="mb-4">Have you put waste through the till?</p>

                <URadioGroup v-model="value" variant="table" :items="items" />
            </div>
            <daily-cash-breakdown-collection
                collection-brow="(Black tin)"
                collection="Banking"
                collection-style="bg-black"
            />
            <daily-cash-breakdown-collection
                collection="Till float"
                collection-style="bg-butterscotch-500"
            />
            <daily-cash-breakdown-collection-safe
                collection-brow="(Red tin)"
                collection="Spare Coins"
                collection-style="bg-red-500"
            />

            <u-textarea
                placeholder="Notes and comments"
                name="Comments"
                variant="outline"
            />
            <u-button type="submit" class="self-end" color="tertiary">
                Submit cash breakdown
            </u-button>
        </form>
        <div v-else-if="state.isSending" class="">Sending, please wait...</div>
    </div>
</template>
<script lang="ts" setup>
import type { RadioGroupValue, RadioGroupItem } from '@nuxt/ui'

const locationsStore = useLocationsStore()

const { completeTask } = useContentfulUtils()
const toast = useToast()

const task: Ref<TypeTaskInstance | null> = ref(null)
const dailyCashBreakdown = ref()

const items = ref<RadioGroupItem[]>([
    'Yes',
    'No, zero waste to declare',
    'No, see notes'
])
const value = ref<RadioGroupValue>('Yes')

const state = reactive({
    isSending: false,
    hasSent: false,
    hasErrored: false
})

const activeLocation: ComputedRef<TypeLocation | undefined> = computed(() => {
    return locationsStore.activeLocation
})

const scriptURL: ComputedRef<string> = computed(() => {
    return activeLocation.value.fields.googleSheetsScriptCashBreakdown || ''
})

onMounted(async () => {
    try {
        const params = {
            content_type: 'taskInstance',
            'fields.location.sys.id': activeLocation.value?.sys?.id,
            'fields.task.sys.contentType.sys.id': 'dailyTask',
            'fields.task.fields.title': 'Cash Breakdown'
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
    const formData = new FormData(dailyCashBreakdown.value)

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
            await completeTask(task.value, 'dailyTasks')
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
    title: 'Daily Cash Breakdown'
})
</script>
