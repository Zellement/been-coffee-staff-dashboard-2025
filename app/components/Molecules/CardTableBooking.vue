<template>
    <transition name="fade">
        <loading-overlay v-if="loading" />
    </transition>
    <u-slideover
        v-model:open="open"
        :title="item.fields.name"
        :description="`Booked for ${item.fields.dateTime ? fullDateConverter(item.fields.dateTime, true) : 'Never'}`"
    >
        <u-card class="cursor-pointer" variant="subtle">
            <div class="flex flex-col items-start gap-1">
                <div class="flex gap-1">
                    <u-badge
                        :variant="getButtonStyle(item.fields.dateTime).variant"
                        :color="getButtonStyle(item.fields.dateTime).colour"
                        size="sm"
                        icon="i-bx-time"
                    >
                        {{ extractHourAndMinute(item.fields.dateTime) }}
                    </u-badge>
                    <u-badge
                        :variant="getButtonStyle(item.fields.dateTime).variant"
                        :color="getButtonStyle(item.fields.dateTime).colour"
                        size="sm"
                        icon="i-bx-time"
                        class="capitalize"
                    >
                        {{ inXDays(item.fields.dateTime) }}
                    </u-badge>
                </div>
                <p>{{ item.fields.name }}</p>
                <div class="mb-1 flex gap-1">
                    <u-badge variant="outline" size="sm" icon="i-bx-user">
                        {{ item.fields.people }}
                    </u-badge>
                </div>
            </div>
        </u-card>
        <template #body>
            <div class="flex flex-col items-start">
                <div class="grid w-full grid-cols-2 gap-2 text-center">
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">Name:</p>
                        <div class="font-semibold">{{ item.fields.name }}</div>
                    </u-card>
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">Date & time:</p>
                        <div class="font-semibold">
                            {{ fullDateConverter(item.fields.dateTime, true) }}
                        </div>
                    </u-card>
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">People:</p>
                        <div class="font-semibold">
                            {{ item.fields.people }}
                        </div>
                    </u-card>
                    <u-card variant="outline" class="flex flex-1 flex-col">
                        <p class="uc-text">Details:</p>
                        <div class="font-semibold">
                            <rich-text :content="item.fields.details" />
                        </div>
                    </u-card>
                </div>
            </div>
        </template>
    </u-slideover>
</template>

<script lang="ts" setup>
interface Props {
    item: TypeTableBooking
}

const open: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

defineProps<Props>()

const { extractHourAndMinute, fullDateConverter, inXDays } = useDateUtils()

const getButtonStyle = (
    dateString: string | undefined
): {
    colour: 'neutral' | 'warning' | 'primary'
    variant: 'solid' | 'outline'
} => {
    if (isToday(dateString)) {
        return {
            colour: 'warning',
            variant: 'solid'
        }
    } else {
        return {
            colour: 'neutral',
            variant: 'outline'
        }
    }
}

const isToday = (dateString: string | undefined): boolean => {
    if (!dateString) return false
    const date = new Date(dateString)
    const today = new Date()
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}
</script>
