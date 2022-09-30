<script>
import applications from "@/framework/applications";

export default {
    name: "MenuPage",
    computed: {
        apps() {
            return applications;
        },
    },
};
</script>

<template>
    <NuxtLayout name="menu">
        <app-icon v-for="app in apps" :key="app.name" :app="app" />
    </NuxtLayout>
</template>
