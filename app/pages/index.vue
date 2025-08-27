<template>
    <div class="page">
        <daily-tasks />
        <routine-tasks />
        <upcoming-deliveries />
        <!-- <rich-text :content="allNoticeBoard.items?.[0]?.fields.content" />
        <h2>Employees</h2>
        <pre>{{ allEmployees }}</pre>
        <h2>Locations</h2>
        <pre>{{ allLocations }}</pre>
        <pre>{{ allNoticeBoard }}</pre> -->
        <!-- <kitchen-sink /> -->
    </div>
</template>

<script setup lang="ts">
// const data: Ref<any> = ref(null)
// const allEmployees: Ref<TypeEmployee[] | null> = ref(null)
// const allLocations: Ref<any> = ref([])
// const allNoticeBoard: Ref<any> = ref([])

// const { fetchEntry, fetchEntries } = useContentfulUtils()

// data.value = await fetchEntry('5uVK9IyrVhgWmxlUWeg9sC')

// const employeesFetch = await fetchEntries({ content_type: 'employee' })
// // ignore error
// // @ts-expect-error sdf
// allEmployees.value = employeesFetch?.items

// allLocations.value = await fetchEntries({
//     content_type: 'location',
//     include: 1,
//     select: 'sys.id,fields.postcode'
// })
// allNoticeBoard.value = await fetchEntries({
//     content_type: 'noticeBoard',
//     include: 1
// })
</script>
