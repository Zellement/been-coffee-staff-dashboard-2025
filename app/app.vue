<template>
    <u-app :toaster="{ position: 'bottom-left', duration: 3500 }">
        <nuxt-layout>
            <nuxt-page />
        </nuxt-layout>

        <u-modal
            v-model:open="showOverlay"
            :ui="{
                content: 'bg-transparent ring-0 shadow-none'
            }"
            :dismissible="false"
        >
            <template #content>
                <div class="flex items-center p-4">
                    <u-icon
                        class="m-auto"
                        size="32"
                        name="i-svg-spinners-blocks-shuffle-3"
                    />
                </div>
            </template>
        </u-modal>
    </u-app>
</template>

<script setup lang="ts">
const uiStore = useUiStore()

const showOverlay: ComputedRef<boolean> = computed(() => uiStore.refreshing)
</script>
