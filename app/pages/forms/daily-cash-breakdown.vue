<template>
    <div class="p-default">
        <h1 class="uc-text mb-8">Daily Cash Breakdown</h1>

        <div ref="statusAlert" class="scroll-mt-40">
            <u-alert
                v-if="state.hasSent"
                color="success"
                title="Success"
                description="Your cash breakdown has been submitted successfully."
                icon="material-symbols:check-circle-rounded"
                :ui="{
                    icon: 'text-lg'
                }"
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
                v-else-if="state.isSending"
                class="mb-6"
                color="neutral"
                title="Sending..."
                description="Your cash breakdown is being sent to Google Sheets.  Please wait."
                icon="i-svg-spinners-blocks-shuffle-3"
                :ui="{
                    icon: 'text-lg'
                }"
            />
            <u-alert
                v-else-if="state.hasErrored"
                class="mb-6"
                color="error"
                title="Error"
                :description="errorDescription"
                icon="ic:round-warning"
            />
        </div>

        <form
            v-show="!state.hasSent"
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
            <daily-cash-breakdown-collection-banking
                collection-brow="(Black tin)"
                collection="Banking"
                collection-style="bg-black"
            />
            <daily-cash-breakdown-collection-till-float
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
            <u-button
                type="submit"
                class="self-end"
                color="tertiary"
                :loading="state.isSending"
                :disabled="state.isSending"
            >
                {{
                    state.hasErrored
                        ? 'Resubmit cash breakdown'
                        : 'Submit cash breakdown'
                }}
            </u-button>
        </form>
    </div>
</template>
<script lang="ts" setup>
import type { RadioGroupValue, RadioGroupItem } from '@nuxt/ui'

const locationsStore = useLocationsStore()

const { completeTask } = useContentfulUtils()
const toast = useToast()
const route = useRoute()

const task: Ref<TypeTaskInstance | null> = ref(null)
const dailyCashBreakdown = ref()
const statusAlert = ref<HTMLElement | null>(null)

/**
 * The alert sits above a long form, so bring it into view — otherwise a user
 * submitting from the bottom of the page sees nothing happen.
 */
const scrollToStatusAlert = async (): Promise<void> => {
    await nextTick()
    statusAlert.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const items = ref<RadioGroupItem[]>([
    'Yes',
    'No, zero waste to declare',
    'No, see notes'
])
const value = ref<RadioGroupValue>('Yes')

const state = reactive({
    isSending: false,
    hasSent: false,
    hasErrored: false,
    attempts: 0,
    errorMessage: ''
})

const errorDescription: ComputedRef<string> = computed(() => {
    const detail = state.errorMessage ? ` (${state.errorMessage})` : ''

    return state.attempts > 1
        ? `Your cash breakdown still hasn't sent after ${state.attempts} attempts${detail}. Your figures are still here, so you can try again — if it keeps failing, please contact Dan.`
        : `There was an error submitting your cash breakdown${detail}. Your figures have been kept, so please try again. If it fails again, please contact Dan.`
})

const activeLocation: ComputedRef<TypeLocation | undefined> = computed(() => {
    return locationsStore.activeLocation
})

const scriptURL: ComputedRef<string> = computed(() => {
    return activeLocation.value?.fields?.googleSheetsScriptCashBreakdown || ''
})

onMounted(async () => {
    try {
        const params = {
            content_type: 'taskInstance',
            'fields.location.sys.id': activeLocation.value?.sys?.id,
            'fields.task.sys.contentType.sys.id': 'dailyTask',
            'fields.task.sys.id': '1DfoZhwRNo3Q64VMD2UL4R'
        }
        const data = await $fetch('/api/contentful/fetch-entries', { params })
        if (data?.items?.length) {
            task.value = data.items[0] || null
        }
    } catch (error) {
        console.error('Error fetching task instance:', error)
    }
})

// Set once the sheet has accepted the data, so a retry after a later failure
// (e.g. completing the Contentful task) doesn't send a duplicate row.
const hasReachedSheet = ref(false)

const submitToGoogleSheets = async () => {
    if (state.isSending) return

    // Read the values out of the still-mounted form before anything can change.
    const formData = new FormData(dailyCashBreakdown.value)

    state.isSending = true
    state.hasErrored = false
    state.errorMessage = ''
    state.attempts += 1

    await scrollToStatusAlert()

    try {
        // TEMPORARY: dev-only failure simulation. Add ?fail=1 to the URL to
        // force the submission to fail without touching Google Sheets.
        // if (import.meta.dev && route.query.fail) {
        //     throw new Error('Simulated failure (?fail=1)')
        // }

        if (!scriptURL.value || typeof scriptURL.value !== 'string') {
            toast.add({ title: 'Google Sheets script URL is not defined.' })
            throw new Error('Google Sheets script URL is not defined.')
        }

        if (!hasReachedSheet.value) {
            const response: Response = await fetch(scriptURL.value, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                toast.add({ title: 'Error sending data to Google Sheets.' })
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            hasReachedSheet.value = true
        }

        if (task.value) {
            await completeTask(task.value, 'dailyTasks')
        }

        state.hasSent = true
    } catch (error: any) {
        state.hasErrored = true
        state.errorMessage = error?.message || String(error)
        console.error('Error!', state.errorMessage)
    } finally {
        state.isSending = false
        await scrollToStatusAlert()
    }
}

useHead({
    title: 'Daily Cash Breakdown | Been Coffee Staff Dashboard'
})
</script>
