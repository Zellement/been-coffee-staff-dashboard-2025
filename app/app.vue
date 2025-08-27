<template>
    <u-app :toaster="{ position: 'bottom-left', duration: 2000 }">
        <nuxt-layout>
            <nuxt-page />
        </nuxt-layout>

        <UModal v-model:open="showOverlay" :dismissible="false">
            <template #content>
                <div class="flex items-center p-4">
                    <u-icon
                        class="m-auto"
                        name="i-svg-spinners-blocks-shuffle-3"
                    />
                </div>
            </template>
        </UModal>
    </u-app>
</template>

<script setup lang="ts">
const uiStore = useUiStore()

const showOverlay: ComputedRef<boolean> = computed(() => uiStore.refreshing)
</script>
