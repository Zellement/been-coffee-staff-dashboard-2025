<template>
    <div
        class="from-seashell-900 to-seashell-400 fixed bottom-0 left-0 z-10 flex w-full bg-gradient-to-br p-1"
    >
        <span class="uc-text uc-text--xs">
            {{ shortDateConverter(today) }}
        </span>
    </div>
</template>

<script lang="ts" setup>
const today = new Date()

const { shortDateConverter } = useDateUtils()
</script>
