<script lang="ts">
import applications, { Application } from "@/framework/applications";
import carmedia from "@/framework";

import { format } from "date-fns";

export default {
    name: "AppPage",
    data() {
        return {
            date: null,
            time: null,
        }
    },
    computed: {
        apps() {
            return applications;
        },
        current_app() {
            return carmedia.activeApplication || {
                id: "home",
                name: "Home",
                icon: "mdi:home",
                path: "/",
            } as Application;
        },
    },
    methods: {
        updateTime() {
            this.time = format(new Date(), "HH:mm")
        },
    },
    mounted() {
        setInterval(this.updateTime.bind(this), 1000);
    }
};
</script>

<template>
    <NuxtLayout name="app">
        <template #header>
            <div class="header-time">{{ time }}</div>
            <div class="spacer"></div>
            <status-icon icon="mdi:bluetooth" width="2.5rem" />
            <status-icon icon="mdi:signal" width="2.5rem" />
        </template>
        <template #default>
            <app-icon :app="current_app" />
            <template v-for="app in apps">
                <app-icon v-if="app.id != current_app.id" :key="app.name" :app="app" />
            </template>
        </template>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.header-time {
    margin-left: 1rem;
    font-size: 20px;
}
</style>
