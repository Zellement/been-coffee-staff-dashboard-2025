<template>
    <div class="p-default mb-8">
        <carousel-title-and-action title="Team" />
        <u-carousel
            v-slot="{ item }"
            dots
            :items="allLocationTeam"
            :ui="{
                root: 'flex',
                container: 'items-center h-full',
                item: 'basis-62'
            }"
        >
            <u-card variant="subtle">
                <div class="flex w-full flex-col items-center p-2 text-center">
                    <h2 class="uc-text">
                        {{ item.fields.name }}
                    </h2>
                    <h3>
                        {{ item.fields.jobRole }}
                        {{
                            item.fields.jobRoleAddendum
                                ? ` (${item.fields.jobRoleAddendum})`
                                : ''
                        }}
                    </h3>
                    <u-field-group class="mt-2">
                        <u-badge
                            variant="outline"
                            size="sm"
                            color="tertiary"
                            icon="i-material-symbols-play-circle-rounded"
                            :label="
                                item.fields.startDate
                                    ? `${new Date(
                                          item.fields.startDate
                                      ).toLocaleDateString(undefined, {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                      })}`
                                    : 'Start date unknown'
                            "
                        />
                        <u-badge
                            variant="outline"
                            size="sm"
                            color="tertiary"
                            icon="i-icon-park-solid-birthday-cake"
                            :label="
                                item.fields.dateOfBirth
                                    ? `${new Date(
                                          item.fields.dateOfBirth
                                      ).toLocaleDateString(undefined, {
                                          month: 'short',
                                          day: 'numeric'
                                      })}`
                                    : 'Birthday unknown'
                            "
                        />
                    </u-field-group>

                    <u-drawer
                        :title="`${item.fields.name} ${item.fields.surname}`"
                    >
                        <button>
                            <img
                                class="mt-4 w-full rounded shadow-xl"
                                :src="`${
                                    item.fields.photo?.[0]?.fields?.file?.url
                                }?w=600&h=740&fit=fill&f=face&fm=webp`"
                                :alt="item.fields.name"
                            />
                        </button>

                        <template #body>
                            <u-timeline
                                :items="fullHistoryData(item)"
                                size="md"
                            />
                        </template>
                    </u-drawer>
                </div>
            </u-card>
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
import type { TimelineItem } from '@nuxt/ui'

const locationsStore = useLocationsStore()

const allLocationTeam: ComputedRef<TypeBeenAwesomeWinner[]> = computed(() => {
    return locationsStore.getAllTeamMembers || []
})

const { shortDateConverter } = useDateUtils()

const fullHistoryData = (employee: TypeEmployee): TimelineItem[] => {
    return [
        {
            title: 'Joined Been Coffee',
            date: shortDateConverter(new Date(employee.fields.startDate)),
            icon: 'i-lucide-milestone'
        },
        ...employee.fields.history.map((item: any) => ({
            title: item.key,
            date: item.value,
            icon: 'i-lucide-milestone'
        }))
    ]
}
</script>
