<template>
    <div
        class="dark:from-primary-600 dark:to-primary-500 from-secondary-100 to-secondary-50 fixed bottom-0 left-0 z-10 flex w-full items-center justify-between bg-gradient-to-b p-1 py-2"
    >
        <div class="flex items-center gap-4">
            <nuxt-link to="/">
                <u-icon size="20" name="i-bx-home" />
            </nuxt-link>
            <colour-mode />
        </div>
        <span class="uc-text uc-text--xs">
            {{ shortDateConverter(today) }}
        </span>
        <site-nav />
    </div>
</template>

<script lang="ts" setup>
const today = new Date()

const { shortDateConverter } = useDateUtils()
</script>
