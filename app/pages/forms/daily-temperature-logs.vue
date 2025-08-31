<template>
    <div class="p-default">
        <h1 class="uc-text">Daily Temperature Logs</h1>

        <div
            v-if="state.hasSent"
            class="flex flex-col items-center gap-4 border border-green-500 p-4"
        >
            <div class="flex flex-row gap-4">
                <Icon
                    name="ph:snowflake-bold"
                    class="h-12 w-12 animate-pulse"
                />
                <div>
                    <h2 class="h2">
                        Yeah, we <span class="text-blue-500">cool</span>, but
                        just to make sure...
                    </h2>
                </div>
            </div>
            <nuxt-link
                class="button bg-butterscotch flex items-center gap-2 !text-black hover:!text-white"
                to="https://docs.google.com/spreadsheets/d/1Bh5vjjW7wU8HaMsP7-R0M0XTlx1Ohd9uh25AK3ZZrIY/edit#gid=0"
                target="_blank"
            >
                <Icon
                    name="ph:warning-fill"
                    class="pointer-events-none h-4 w-4 flex-shrink-0 text-red-500 transition-all duration-300 hover:rotate-90"
                />
                Please check your submission was logged. Click here...
                <Icon
                    name="iconamoon:link-external-fill"
                    class="pointer-events-none h-4 w-4 flex-shrink-0 transition-all duration-300 hover:rotate-90"
                />
            </nuxt-link>
            <p class="text-xs">
                To see the form again, please refresh this page.
            </p>
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
                <p class="text-xs">
                    To see the form again, please refresh this page.
                </p>
            </div>
        </div>

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
            <temperature-log-input item="Milk Fridge" />
            <temperature-log-input item="Blender Fridge" />
            <temperature-log-input item="Savoury Fridge" />
            <temperature-log-input item="Savoury Display" />
            <temperature-log-input item="Bar Freezer" plus-or-minus="minus" />
            <temperature-log-input
                item="Daltons Freezer"
                plus-or-minus="minus"
            />
            <h2 class="uc-text">Back of House</h2>
            <temperature-log-input
                item="Double Freezer"
                plus-or-minus="minus"
            />
            <temperature-log-input
                item="Single Freezer"
                plus-or-minus="minus"
            />
            <temperature-log-input item="Fridge" />
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
<script setup>
const dailyTemperatureLogs = ref()

const runtimeConfig = useRuntimeConfig()

const scriptURL =
    runtimeConfig.public.GOOGLE_SHEETS_SCRIPT_DAILY_TEMPERATURE_LOGS

const submitToGoogleSheets = () => {
    const formData = new FormData(dailyTemperatureLogs.value)
    // const user = formData.get('Team member')
    // const dateTime = new Date()
    state.isSending = true
    state.hasSent = false
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(async () => {
            state.isSending = false
            state.hasSent = true
        })
        .catch((error) => console.error('Error!', error.message))
}

useHead({
    title: 'Daily Temperature Logs'
})

const state = reactive({
    isSending: false,
    hasSent: false,
    hasErrored: false
})
</script>
