<template>
    <div class="m-2 mt-0 flex flex-col">
        <div
            class="p-default dark:from-primary-600 dark:to-primary-500 card-border from-secondary-100 mt-0 rounded-br rounded-bl bg-gradient-to-b dark:!border-t-0"
        >
            <u-drawer
                direction="top"
                inset
                title="Show more user information"
                description="View your profile information"
            >
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
                    <div
                        class="p-default mx-auto flex w-full max-w-sm flex-col gap-5"
                    >
                        <div class="grid w-full grid-cols-3 items-center">
                            <span>Switch location</span>
                            <location-switcher class="col-span-2" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <template
                                v-for="(data, index) in profileData"
                                :key="index"
                            >
                                <div
                                    v-if="data.value"
                                    class="grid w-full grid-cols-3 items-center"
                                >
                                    <span>{{ data.key }}</span>
                                    <span class="col-span-2 font-bold">
                                        {{ data.value ?? 'N/A' }}
                                    </span>
                                </div>
                            </template>
                        </div>
                        <div class="flex flex-col gap-2">
                            <h2 class="font-bold">Your history</h2>
                            <div
                                class="grid grid-cols-3 gap-1 overflow-clip rounded-tl rounded-tr font-bold"
                            >
                                <span
                                    class="bg-secondary text-seashell px-2 py-1"
                                >
                                    Date
                                </span>
                                <span
                                    class="bg-secondary text-seashell col-span-2 px-2 py-1"
                                />
                            </div>

                            <div class="grid grid-cols-3">
                                <span class="px-2 py-1">
                                    {{ startDate }}
                                </span>
                                <span class="col-span-2 px-2 py-1 font-bold">
                                    Started at Been Coffee
                                </span>
                            </div>

                            <template
                                v-for="(data, index) in historyData"
                                :key="index"
                            >
                                <div
                                    v-if="data.value"
                                    class="grid w-full grid-cols-3 items-center"
                                >
                                    <span class="px-2 py-1">
                                        {{ data.value ?? 'N/A' }}
                                    </span>
                                    <span
                                        class="col-span-2 px-2 py-1 font-bold"
                                    >
                                        {{ data.key }}
                                    </span>
                                </div>
                            </template>
                        </div>

                        <auth-sign-out class="ml-auto" />
                    </div>
                </template>
            </u-drawer>
        </div>
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
const { getMonthAndDayOnly, shortDateConverter } = useDateUtils()

const profileData: ComputedRef<{ key: string; value: string | undefined }[]> =
    computed(() => {
        return [
            {
                key: 'Role',
                value: userStore.userContentfulData?.fields?.jobRole
            },
            {
                key: 'Date of Birth',
                value: getMonthAndDayOnly(
                    new Date(userStore.userContentfulData?.fields?.dateOfBirth)
                )
            },
            {
                key: 'Till PIN',
                value: userStore.userContentfulData?.fields?.tillPin
            }
        ]
    })

const startDate: ComputedRef<string | undefined> = computed(() => {
    return shortDateConverter(
        new Date(userStore.userContentfulData?.fields?.startDate)
    )
})

const historyData: ComputedRef<
    { id: string; key: string; value: string | undefined }[]
> = computed(() => {
    return userStore.userContentfulData.fields.history
})
</script>
