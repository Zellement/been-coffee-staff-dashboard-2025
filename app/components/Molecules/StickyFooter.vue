<template>
    <div
        class="from-seashell-400 to-seashell-100 dark:from-secondary-500 dark:to-secondary-700 fixed bottom-0 left-0 z-10 flex w-full items-center justify-between bg-gradient-to-t p-1"
    >
        <span class="uc-text uc-text--xs">
            {{ shortDateConverter(today) }}
        </span>

        <colour-mode />
    </div>
</template>

<script lang="ts" setup>
const today = new Date()

const { shortDateConverter } = useDateUtils()
</script>
