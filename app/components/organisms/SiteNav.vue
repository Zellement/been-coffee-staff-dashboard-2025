<template>
    <u-slideover title="Dashboard navigation">
        <u-button
            label="Menu"
            size="xs"
            color="neutral"
            variant="subtle"
            trailing-icon="i-material-symbols-light-menu-open-rounded"
            :ui="{
                trailingIcon: '!size-5'
            }"
        />

        <template #body>
            <Placeholder class="m-4 h-full" />
        </template>
    </u-slideover>
</template>

<script lang="ts" setup></script>
