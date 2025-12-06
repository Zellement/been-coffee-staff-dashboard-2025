<template>
    <div class="sticky top-0 z-30 m-2 mt-0 flex flex-col">
        <div
            class="p-default bg-secondary-100 dark:bg-primary-600 card-border mt-0 flex items-center justify-between rounded-br rounded-bl dark:!border-t-0"
        >
            <u-drawer
                direction="top"
                inset
                title="Show more user information"
                description="View your profile information"
            >
                <button class="flex w-full cursor-pointer items-center gap-2">
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
                        <div
                            v-if="!isGeneralLogin"
                            class="grid w-full grid-cols-3 items-center"
                        >
                            <span>Switch location</span>
                            <location-switcher class="col-span-2" />
                        </div>
                        <div v-if="!isGeneralLogin" class="flex flex-col gap-2">
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
                        <div v-if="!isGeneralLogin" class="flex flex-col gap-2">
                            <h2 class="uc-text">Your history</h2>

                            <u-timeline
                                v-if="fullHistoryData.length"
                                :items="fullHistoryData"
                                size="md"
                            />
                        </div>

                        <auth-sign-out
                            :class="isGeneralLogin ? 'mx-auto mt-4' : 'ml-auto'"
                        />
                    </div>
                </template>
            </u-drawer>

            <share-button />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { TimelineItem } from '@nuxt/ui'

const userStore = useUserStore()

const displayName: ComputedRef<string> = computed(() => {
    return (
        userStore.userContentfulData?.fields?.name ??
        userStore.userData?.display_name
    )
})
const { getMonthAndDayOnly, shortDateConverter } = useDateUtils()

const isGeneralLogin: ComputedRef<boolean> = computed(() => {
    return userStore.isGeneralLogin
})

const profileData: ComputedRef<{ key: string; value: string | undefined }[]> =
    computed(() => {
        return [
            {
                key: 'Role',
                value: userStore.userContentfulData?.fields?.jobRole
            },
            {
                key: 'Birthday',
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

const fullHistoryData: ComputedRef<TimelineItem[]> = computed(() => {
    const userHistory = userStore.userContentfulData?.fields?.history ?? []
    return [
        {
            title: 'Joined Been Coffee',
            date: startDate.value,
            icon: 'i-lucide-milestone'
        },
        ...userHistory.map((item: any) => ({
            title: item.key,
            date: item.value,
            icon: 'i-lucide-milestone'
        }))
    ]
})
</script>
