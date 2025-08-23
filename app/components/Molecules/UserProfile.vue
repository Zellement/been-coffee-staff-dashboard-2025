<template>
    <div class="p-default m-2 mt-0 rounded-br rounded-bl bg-white shadow">
        <u-drawer direction="top" inset>
            <button class="flex w-full items-center gap-2">
                <div
                    v-if="userStore.userContentfulData?.fields?.photo?.[0]"
                    class="w-10"
                >
                    <img
                        class="border-butterscotch-500 rounded-full border-2 object-cover"
                        :src="`${
                            userStore.userContentfulData?.fields?.photo?.[0]
                                ?.fields?.file?.url
                        }?w=50&h=50&fit=fill&f=face&fm=webp`"
                        :alt="userStore.userContentfulData?.fields?.name"
                    />
                </div>
                <img
                    v-else
                    class="size-10"
                    src="@/assets/images/been-staff-dashboard.png"
                />

                <span class="text-md font-bold">
                    Hello,
                    <span class="">
                        {{ displayName }}
                    </span>
                </span>
            </button>
            <template #content>
                <location-switcher />
                <auth-sign-out />
            </template>
        </u-drawer>
    </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()

const displayName: ComputedRef<string> = computed(() => {
    return (
        userStore.userContentfulData?.fields?.name ??
        userStore.userData?.display_name
    )
})
</script>
