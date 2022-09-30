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
            <vbutton icon="mdi:arrow-left" height="3rem" width="4rem" />
            <div>Home</div>
        </template>
        <template #default>
            <app-icon v-for="app in apps" :key="app.name" :app="app" />
        </template>
    </NuxtLayout>
</template>
