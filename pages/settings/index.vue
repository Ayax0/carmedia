<script>
import store from "store-js";

export default {
    name: "GeneralSettingsPage",
    data() {
        return {
            display_name: null,
        };
    },
    watch: {
        display_name(value) {
            store.set("general.display_name", value);
        },
    },
    mounted() {
        this.display_name = store.get("general.display_name");
    },
};
</script>

<template>
    <div class="main">
        <vtextfield v-model="display_name" title="Anzeigename" />
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    padding: 2rem;

    .title {
        margin-top: 2rem;
    }
}
</style>
