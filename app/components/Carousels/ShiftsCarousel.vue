<template>
    <div class="p-c-default">
        <UCarousel v-slot="{ item }" :items="slides" dots>
            <component :is="item.component" v-bind="item.props" />
        </UCarousel>
    </div>
</template>

<script lang="ts" setup>
import ShiftsToday from '~/components/organisms/ShiftsToday.vue'
import ShiftsTomorrow from '~/components/organisms/ShiftsTomorrow.vue'

const slides: any[] = [
    { component: ShiftsToday },
    { component: ShiftsTomorrow }
]
</script>
