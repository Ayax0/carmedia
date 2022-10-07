<script>
import store from "store-js";

export default {
    name: "NavigationSettingsPage",
    data() {
        return {
            api_key: null,
        };
    },
    watch: {
        api_key(value) {
            store.set("navigation.api_key", value);
        },
    },
    mounted() {
        this.api_key = store.get("navigation.api_key");
    },
};
</script>

<template>
    <div class="main">
        <vtextfield v-model="api_key" title="Google API Key" />
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    padding: 2rem;
}
</style>
