<template>
    <div class="page">
        <pre>{{ data }}</pre>
        <kitchen-sink />
    </div>
</template>

<script setup lang="ts">
const data: Ref<any> = ref(null)
const { fetchEntry } = useContentfulUtils()

onMounted(async () => {
    data.value = await fetchEntry('5uVK9IyrVhgWmxlUWeg9sC')
})
</script>
