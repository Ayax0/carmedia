<script>
import applications from "@/framework/applications";

export default {
    name: "AppPage",
    computed: {
        apps() {
            return applications;
        },
    },
};
</script>

<template>
    <NuxtLayout name="app">
        <template #header>
            <div class="spacer"></div>
            <status-icon icon="mdi:bluetooth" width="2.5rem" />
            <status-icon icon="mdi:signal" width="2.5rem" />
        </template>
        <template #default>
            <app-icon v-for="app in apps" :key="app.name" :app="app" />
        </template>
    </NuxtLayout>
</template>

<style lang="scss" scoped></style>
