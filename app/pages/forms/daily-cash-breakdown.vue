<template>
    <p>cash</p>
    <!-- <div class="mx-auto flex w-full max-w-screen-md flex-col px-10 pt-0 pb-32">
        <h1 class="h1 mb-8">Daily Cash Breakdown</h1>

        <div
            v-if="state.hasSent"
            class="mb-8 flex flex-row items-center gap-6 border border-green-500 p-4"
        >
            <Icon name="noto-v1:party-popper" class="h-12 w-12 animate-pulse" />
            <div>
                <h2 class="h2">Yeah, we all good!</h2>
                <p>All sent, thanks.</p>
                <p class="text-xs">
                    To see the form again, please refresh this page.
                </p>
            </div>
        </div>

        <div
            v-if="state.hasErrored"
            class="mb-8 flex flex-row items-center gap-6 border border-red-500 p-4"
        >
            <Icon
                name="noto:skull-and-crossbones"
                class="h-12 w-12 animate-ping"
            />
            <div>
                <h2 class="h2">Hmmm...</h2>
                <p>
                    Looks like something isn't behaving. Please let Dan know
                    pronto.
                </p>
                <p>
                    In the meantime, let's go old school and
                    <a
                        class="underline"
                        href="https://forms.gle/ain6gfLguMcnRQsa7"
                        target="_blank"
                        >use this form</a
                    >.
                </p>
                <p class="text-xs">
                    To see the form again, please refresh this page.
                </p>
            </div>
        </div>

        <form
            v-if="!state.isSending && !state.hasSent && !state.hasErrored"
            id="daily-cash-breakdown"
            ref="dailyCashBreakdown"
            class="daily-cash-breakdown-form flex flex-col gap-8"
            name="daily-cash-breakdown"
            @submit.prevent="submitToGoogleSheets"
        >
            <shift-leads />

            <div>
                <h2 class="h4">Waste</h2>
                <p class="mb-4">Have you put waste through the till?</p>
                <label class="flex flex-row items-center gap-2">
                    <input
                        type="radio"
                        required
                        value="yes"
                        name="Waste thru till"
                    />
                    <span>Yes</span>
                </label>
                <label class="flex flex-row items-center gap-2">
                    <input
                        type="radio"
                        required
                        value="No, zero waste to declare"
                        name="Waste thru till"
                    />
                    <span>No, zero waste to declare</span>
                </label>
                <label class="flex flex-row items-center gap-2">
                    <input
                        type="radio"
                        required
                        value="No, see notes"
                        name="Waste thru till"
                    />
                    <span>No, see notes</span>
                </label>
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
            <textarea
                placeholder="Notes and comments"
                class="h-40"
                name="Comments"
            />
            <button type="submit" class="button">I'm done, submit!</button>
        </form>
        <div v-else-if="state.isSending" class="">Sending, please wait...</div>
    </div> -->
</template>
<script setup>
// import { useSupabaseStore } from '@/stores/supabase'

// const supabaseStore = useSupabaseStore()

// const dailyCashBreakdown = ref()

// const runtimeConfig = useRuntimeConfig()

// const scriptURL = runtimeConfig.public.GOOGLE_SHEETS_SCRIPT_DAILY_CASH_BREAKDOWN
// // const form = document.forms['submit-to-google-sheet']

// const submitToGoogleSheets = () => {
//     const formData = new FormData(dailyCashBreakdown.value)
//     const user = formData.get('Team member')
//     const dateTime = new Date()
//     state.isSending = true
//     state.hasSent = false
//     fetch(scriptURL, { method: 'POST', body: formData })
//         .then(async () => {
//             await supabaseStore.setCheck('daily_cash_breakdown', user)
//             await supabaseStore.setCheck('daily_cash_breakdown_time', dateTime)
//             state.isSending = false
//             state.hasSent = true
//         })
//         .catch((error) => console.error('Error!', error.message))
// }

// useHead({
//     title: 'Daily Cash Breakdown'
// })

// const state = reactive({
//     isSending: false,
//     hasSent: false,
//     hasErrored: false
// })
</script>
