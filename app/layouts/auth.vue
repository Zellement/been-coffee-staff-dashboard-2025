<template>
    <div class="layout p-default">
        <div class="flex flex-col gap-4 pt-8">
            <brand-logo class="mx-auto max-w-16" />
            <h1 class="font-riverside text-center text-lg">
                <span class="hidden">Been Coffee</span>Dashboard
            </h1>
        </div>
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts"></script>
