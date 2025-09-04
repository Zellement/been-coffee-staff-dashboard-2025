<template>
    <div class="p-default mb-8">
        <div class="flex items-center justify-between">
            <h2 class="uc-text uc-text--carousel-title">Team</h2>
        </div>
        <u-carousel
            v-slot="{ item }"
            dots
            drag-free
            :items="allLocationTeam"
            :ui="{
                root: 'flex',
                container: 'items-center h-full',
                item: 'ps-2 basis-56'
            }"
        >
            <u-card variant="subtle">
                <div class="flex w-full flex-col items-center p-2 text-center">
                    <h2 class="uc-text">
                        {{ item.fields.name }}
                    </h2>
                    <h3>{{ item.fields.jobRole }}</h3>

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
