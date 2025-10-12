<template>
    <div
        class="dark:from-primary-600 dark:to-primary-500 from-secondary-100 p-default to-secondary-50 fixed bottom-0 left-0 z-10 flex w-full items-center justify-between bg-gradient-to-b !pb-3"
    >
        <div class="flex items-center gap-3">
            <nuxt-link class="flex items-center" to="/">
                <u-icon size="20" name="i-bx-home" />
            </nuxt-link>
            <colour-mode />
            <nuxt-link
                class="flex items-center"
                target="_blank"
                to="https://docs.google.com/forms/d/e/1FAIpQLSdyaHq-gL-3DVxL97QI5B2Eo6OIq575m5dohbCuIIqV2xyLkQ/viewform"
            >
                <u-icon size="20" name="i-tdesign-tools-filled" />
            </nuxt-link>
            <nuxt-link class="flex items-center" to="/recipes">
                <u-icon
                    size="20"
                    name="streamline-plump:chef-toque-hat-solid"
                />
            </nuxt-link>

            <!-- <nuxt-link
                class="flex items-center"
                target="_blank"
                to="https://forms.gle/X1kpEXwjHdm7tFRx8"
            >
                <u-icon size="20" name="i-majesticons-bug-2-line" />
            </nuxt-link> -->
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
