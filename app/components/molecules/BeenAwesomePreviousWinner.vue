<template>
    <u-card variant="subtle">
        <u-slideover
            :title="`${winner.fields.name} - ${fullDateConverter(winner.fields.from)}`"
        >
            <div class="flex w-full flex-col items-center p-5 text-center">
                <h2 class="uc-text mb-2">
                    {{ winner.fields.name }}
                </h2>
                <u-field-group>
                    <u-badge
                        variant="outline"
                        size="sm"
                        color="tertiary"
                        icon="i-bx-log-in"
                        :label="
                            winner.fields.from
                                ? `${new Date(
                                      winner.fields.from
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
                        trailing-icon="i-bx-log-out"
                        :ui="{
                            trailingIcon: 'rotate-180'
                        }"
                        :label="
                            fullDateConverter(
                                getFollowingWinnersStartDate(index)
                            )
                        "
                    />
                </u-field-group>

                <p class="mt-2">
                    {{
                        duration(
                            getFollowingWinnersStartDate(index),
                            winner.fields.from
                        )
                    }}
                    days
                </p>

                <img
                    class="mt-4 w-full rounded shadow-xl"
                    :src="`${
                        winner.fields.photo?.fields?.file?.url
                    }?w=300&h=370&fit=fill&f=face&fm=webp`"
                    :alt="winner.fields.name"
                />
            </div>
            <template #body>
                <div class="whitespace-pre-line">
                    {{ winner.fields.details }}
                </div>
            </template>
        </u-slideover>
    </u-card>
</template>

<script lang="ts" setup>
interface Props {
    winner: TypeBeenAwesomeWinner
    allWinners: TypeBeenAwesomeWinner[]
    index: number
}

const props = defineProps<Props>()

const { fullDateConverter } = useDateUtils()

/* Functions & lifecycle */

const getFollowingWinnersStartDate = (index: number) => {
    return props.allWinners?.[index - 1]?.fields.from
}

const duration = (to: string, from: string) => {
    const startDate = new Date(from)
    const endDate = new Date(to)
    const months = (endDate.getTime() - startDate.getTime()) / 1000 / 86400
    return months
}
</script>
