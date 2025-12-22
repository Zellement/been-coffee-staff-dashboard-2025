<template>
    <ul class="flex max-h-110 grid-cols-1 flex-col gap-4 overflow-y-auto">
        <li
            v-for="(item, index) in allWinners.slice(7)"
            :key="item.sys.id"
            class="flex flex-row items-center gap-2"
        >
            <img
                v-if="item.fields?.photo.fields?.file.url"
                class="hexagon-clip relative z-10 size-10 shrink-0 rounded-full"
                :src="`${
                    item.fields?.photo.fields?.file.url
                }?w=90&h=90&fit=fill&f=face&fm=webp`"
                :alt="`${item.fields?.name} ${item.fields?.surname}`"
            />
            <p class="flex flex-col items-center">
                <span>{{ item.fields?.name }}</span>
            </p>
            <u-field-group class="ml-auto">
                <u-badge
                    variant="outline"
                    size="sm"
                    color="tertiary"
                    icon="i-bx-log-in"
                    :label="
                        item.fields?.from
                            ? `${new Date(item.fields?.from).toLocaleDateString(
                                  undefined,
                                  {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                  }
                              )}`
                            : 'Start date unknown'
                    "
                />
                <u-badge
                    variant="outline"
                    size="sm"
                    color="tertiary"
                    trailing-icon="i-bx-log-out"
                    :ui="{
                        trailingIcon: 'rotate-180'
                    }"
                    :label="
                        fullDateConverter(
                            getFollowingWinnersStartDate(
                                index === 0 ? 7 : index + 7,
                                allWinners
                            )
                        )
                    "
                />
            </u-field-group>
        </li>
    </ul>
</template>

<script lang="ts" setup>
interface Props {
    allWinners: TypeBeenAwesomeWinner[]
}

const { fullDateConverter, getFollowingWinnersStartDate } = useDateUtils()

defineProps<Props>()
</script>
