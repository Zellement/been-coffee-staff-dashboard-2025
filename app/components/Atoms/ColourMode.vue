<template>
    <ClientOnly v-if="!colorMode?.forced">
        <button
            class="flex items-center"
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            size="xl"
            @click="isDark = !isDark"
        >
            <u-icon
                :size="20"
                :name="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            />
        </button>

        <template #fallback>
            <div class="size-8" />
        </template>
    </ClientOnly>
</template>

<script setup>
const colorMode = useColorMode()

const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set(_isDark) {
        colorMode.preference = _isDark ? 'dark' : 'light'
    }
})
</script>
