<template>
    <div
        class="dark:from-primary-600 dark:to-primary-500 from-secondary-100 to-secondary-50 fixed bottom-0 left-0 z-10 flex w-full items-center justify-between bg-gradient-to-b p-1"
    >
        <nuxt-link to="/">
            <u-icon name="i-bx-home" />
        </nuxt-link>
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
