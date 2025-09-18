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
                item: 'ps-2 basis-62'
            }"
        >
            <u-card variant="subtle">
                <div class="flex w-full flex-col items-center p-2 text-center">
                    <h2 class="uc-text">
                        {{ item.fields.name }}
                    </h2>
                    <h3>{{ item.fields.jobRole }}</h3>
                    <u-button-group class="mt-2">
                        <u-button
                            variant="outline"
                            size="xs"
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
                        <u-button
                            variant="outline"
                            size="xs"
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
                    </u-button-group>

                    <img
                        class="mt-4 w-full rounded shadow-xl"
                        :src="`${
                            item.fields.photo?.[0]?.fields?.file?.url
                        }?w=300&h=370&fit=fill&f=face&fm=webp`"
                        :alt="item.fields.name"
                    />
                </div>
            </u-card>
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const allLocationTeam: ComputedRef<TypeBeenAwesomeWinner[]> = computed(() => {
    return locationsStore.getAllTeamMembers || []
})
</script>
