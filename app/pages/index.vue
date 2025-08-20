<template>
    <div class="page">
        <rich-text :content="allNoticeBoard.items?.[0]?.fields.content" />
        <pre>{{ data }}</pre>
        <pre>{{ allEmployees }}</pre>
        <pre>{{ allLocations }}</pre>
        <pre>{{ allNoticeBoard }}</pre>
        <kitchen-sink />
    </div>
</template>

<script setup lang="ts">
const data: Ref<any> = ref(null)
const allEmployees: Ref<any> = ref([])
const allLocations: Ref<any> = ref([])
const allNoticeBoard: Ref<any> = ref([])

const { fetchEntry, fetchEntries } = useContentfulUtils()

onMounted(async () => {
    data.value = await fetchEntry('5uVK9IyrVhgWmxlUWeg9sC')
    allEmployees.value = await fetchEntries({ content_type: 'employee' })
    allLocations.value = await fetchEntries({
        content_type: 'location',
        include: 1,
        select: 'sys.id,fields.postcode'
    })
    allNoticeBoard.value = await fetchEntries({
        content_type: 'noticeBoard',
        include: 1
    })
})
</script>
