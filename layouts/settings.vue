<script>
import applications from "@/framework/applications";

export default {
    name: "SettingsLayout",
    computed: {
        categories() {
            return applications.filter((app) => app.settings != undefined);
        },
    },
};
</script>

<template>
    <div class="main">
        <div class="sidebar">
            <setting-category title="Zurück" icon="mdi:arrow-left-circle" alt href="/app" />
            <setting-category
                v-for="category in categories"
                :key="category.id"
                :title="category.name"
                :icon="category.icon"
                :href="category.settings"
            />
            <slot name="sidebar" />
        </div>
        <div class="content"><slot /></div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-columns: 30% 70%;

    .sidebar {
        display: flex;
        flex-direction: column;
        background: rgba(20, 20, 20, 0.5);
        box-shadow: $shadow;
        overflow: hidden;
        overflow-y: auto;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: hidden;
        overflow-y: auto;
    }
}
</style>
