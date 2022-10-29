<script>
import applications from "@/framework/applications";
import carmedia from "@/framework";

export default {
    name: "AppPage",
    computed: {
        apps() {
            return applications;
        },
        current_app_icon() {
            if(!carmedia.activeApplication) return "mdi:home";
            return carmedia.activeApplication.icon;
        },
        current_app_name() {
            if(!carmedia.activeApplication) return "Home";
            return carmedia.activeApplication.name;
        }
    },
    methods: {
        navigateHome() {
            if(carmedia.activeApplication) navigateTo(carmedia.activeApplication.path)
            else navigateTo("/");
        }
    }
};
</script>

<template>
    <NuxtLayout name="app">
        <template #header>
            <vbutton v-ripple :icon="current_app_icon" iconSize="1.5rem" height="100%" width="auto" @click="navigateHome">{{ current_app_name }}</vbutton>
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
