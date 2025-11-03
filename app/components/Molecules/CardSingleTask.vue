<template>
    <transition name="fade">
        <loading-overlay v-if="loading" />
    </transition>
    <u-slideover
        v-model:open="open"
        :title="item.fields.title"
        :description="`Task best completed by: ${item.fields.whoCanComplete}`"
    >
        <u-card
            class="cursor-pointer"
            variant="subtle"
            :title="item.fields.title"
        >
            <u-badge
                size="sm"
                variant="outline"
                color="neutral"
                icon="i-bx-time"
                class="mb-2"
            >
                Created {{ wasXHoursAgo(item.sys.createdAt) }}
            </u-badge>
            <p class="truncate">{{ item.fields.title }}</p>
            <u-badge class="mt-2" color="primary" variant="outline">
                {{ item.fields.whoCanComplete }}
            </u-badge>
        </u-card>
        <template #body>
            <div class="flex flex-col items-start">
                <rich-text
                    v-if="item.fields.description"
                    :content="item.fields.description"
                />
            </div>
        </template>
        <template #footer>
            <u-button
                v-if="hasCompleteVia"
                :to="item.fields.completeVia"
                color="tertiary"
            >
                Go to form
            </u-button>
            <template v-else>
                <u-button
                    v-if="!isGeneralLogin"
                    :disabled="loading"
                    class="ml-auto"
                    :icon="
                        loading
                            ? 'i-svg-spinners-blocks-shuffle-3'
                            : 'i-bx-check'
                    "
                    color="tertiary"
                    @click="handleCompleteTask(item)"
                >
                    {{ loading ? 'Loading...' : 'Mark as complete' }}
                </u-button>
                <alert-logged-in-as-shop v-else />
            </template>
        </template>
    </u-slideover>
</template>

<script lang="ts" setup>
interface Props {
    item: TypeTaskInstance
}

const userStore = useUserStore()

const isGeneralLogin: ComputedRef<boolean> = computed(() => {
    return userStore.isGeneralLogin
})

const hasCompleteVia: ComputedRef<boolean> = computed(() => {
    return !!props.item.fields.completeVia
})

const open: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

const props = defineProps<Props>()

const { completeTask } = useContentfulUtils()
const { wasXHoursAgo } = useDateUtils()

const handleCompleteTask = async (task: TypeSingleTask) => {
    loading.value = true
    await completeTask(task, 'singleTask')
    loading.value = false
    open.value = false
}
</script>
