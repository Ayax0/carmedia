<script setup lang="ts">
definePageMeta({
    middleware: "spotify",
});
</script>

<template>
    <NuxtLayout name="spotify">
        <NuxtChild />
    </NuxtLayout>
</template>
