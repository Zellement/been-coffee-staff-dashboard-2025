<template>
    <u-card
        variant="solid"
        :ui="{
            root: 'bg-black dark:bg-white'
        }"
    >
        <u-slideover
            :title="`${winner?.fields?.name} - Winner from ${fullDateConverter(winner?.fields?.from)}`"
        >
            <div class="flex flex-col items-center p-8">
                <img
                    src="@/assets/images/beenawesome.png"
                    class="mb-8 w-full max-w-45"
                    :class="
                        colorMode.value === 'dark' ? '' : 'brightness-50 invert'
                    "
                />
                <h2 class="uc-text text-lg text-white! dark:text-black!">
                    {{ winner?.fields?.name }}
                </h2>

                <p v-if="winner?.fields?.from" class="flex items-center gap-1">
                    <u-icon name="i-bx-log-in" />
                    {{ fullDateConverter(winner?.fields?.from) }}
                </p>

                <img
                    class="mt-8 rounded shadow-xl"
                    :src="`${
                        winner?.fields?.photo?.fields?.file?.url
                    }?w=460&h=640&fit=fill&f=face&fm=webp`"
                    :alt="winner?.fields?.name"
                />
            </div>

            <template #body>
                <div class="whitespace-pre-line">
                    {{ winner?.fields?.details }}
                </div>
            </template>
        </u-slideover>
    </u-card>
</template>

<script lang="ts" setup>
interface Props {
    winner: TypeBeenAwesomeWinner
}

defineProps<Props>()

const { fullDateConverter } = useDateUtils()
const colorMode = useColorMode()
</script>
