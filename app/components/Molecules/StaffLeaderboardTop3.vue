<template>
    <div class="grid grid-cols-3 grid-rows-10 gap-6">
        <template v-for="(item, i) in employees" :key="item.sys.id">
            <div
                :class="getColumnData(i).classes"
                class="mt-8 flex flex-col items-center gap-2 rounded-tl-2xl rounded-tr-2xl bg-linear-to-b pb-4"
            >
                <img
                    v-if="item.fields.photo && item.fields.photo.length > 0"
                    class="hexagon-clip relative z-10 -mb-8 size-16 shrink-0 -translate-y-1/2 rounded-full"
                    :src="`${
                        item.fields.photo[0].fields.file.url
                    }?w=90&h=90&fit=fill&f=face&fm=webp`"
                    :alt="`${item.fields.name} ${item.fields.surname}`"
                />
                <u-icon
                    v-if="getColumnData(i).icon"
                    :size="getColumnData(i).iconSize || '40'"
                    :name="getColumnData(i).icon || ''"
                    class="animate-swing -mb-5 size-12 origin-top -translate-y-5"
                    :class="getColumnData(i).iconClasses"
                />
                <p class="flex flex-col items-center">
                    <span>{{ item.fields.name }}</span>
                </p>
                <p class="uc-text text-xl leading-none">
                    {{ item.thisPeriodMinutes }}
                </p>
                <p
                    class="uc-text uc-text--2xs -translate-y-1 text-center leading-none"
                >
                    minutes<br />
                    logged
                </p>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    employees: TypeEmployee[]
}

defineProps<Props>()

interface ColumnData {
    classes: string
    icon?: string
    iconSize?: string
    iconClasses?: string
}

const getColumnData = (index: number): ColumnData => {
    switch (index) {
        case 0:
            return {
                classes:
                    'col-start-2 row-span-full row-start-1 from-yellow-600 to-yellow-500 text-white',
                icon: 'i-hugeicons-medal-first-place',
                iconSize: '48',
                iconClasses: 'text-yellow-300'
            }
        case 1:
            return {
                classes:
                    'col-start-1 row-span-8 row-start-3 from-gray-300 to-gray-500 text-white',
                icon: 'i-hugeicons-medal-second-place',
                iconSize: '40',
                iconClasses: 'text-slate-400'
            }
        case 2:
            return {
                classes:
                    'col-start-3 row-span-6 row-start-5 from-yellow-800 to-yellow-900 text-white',
                icon: 'i-hugeicons-medal-third-place',
                iconSize: '32',
                iconClasses: 'text-yellow-700'
            }
        default:
            return { classes: '', icon: 'i-hugeicons-medal-third-place' }
    }
}
</script>
