<script>
import store from "store-js";

export default {
    name: "GeneralSettingsPage",
    data() {
        return {
            display_name: null,
            default_volume: 20,
        };
    },
    watch: {
        display_name(value) {
            store.set("general.display_name", value);
        },
        default_volume(value) {
            store.set("general.default_volume", value);
        }
    },
    mounted() {
        this.display_name = store.get("general.display_name");
        this.default_volume = store.get("general.default_volume") || 20;
    },
};
</script>

<template>
    <div class="main">
        <vtextfield v-model="display_name" title="Anzeigename" />
        <div class="title">Startlautstärke</div>
        <horizontal-slider v-model="default_volume" />
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
