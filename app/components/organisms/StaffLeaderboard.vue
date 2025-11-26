<template>
    <div class="">{{ lastFriday }}{{ periodStart }}</div>
</template>

<script lang="ts" setup>
const { getPayPeriodStartFrom } = useDateUtils()

const today = new Date()
const { periodStart, lastFriday } = getPayPeriodStartFrom(today)
</script>
