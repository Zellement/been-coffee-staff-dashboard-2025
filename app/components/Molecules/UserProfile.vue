<template>
    <div class="p-2">
        <u-drawer direction="top" inset>
            <button class="flex w-full items-center gap-2">
                <div class="w-10">
                    <img
                        class="border-butterscotch-500 rounded-full border-2 object-cover"
                        :src="`${
                            userStore.userContentfulData?.fields?.photo?.[0]
                                ?.fields?.file?.url
                        }?w=50&h=50&fit=fill&f=face&fm=webp`"
                        :alt="userStore.userContentfulData?.fields?.name"
                    />
                </div>

                <span class="text-md font-bold">
                    Hello,
                    {{ userStore.userContentfulData?.fields?.name }}</span
                >
            </button>
            <template #content>
                <location-switcher />
            </template>
        </u-drawer>
    </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
</script>
