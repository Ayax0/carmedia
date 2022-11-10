<script>
import store from "store-js";

export default {
    name: "GeneralSettingsPage",
    data() {
        return {
            display_name: null,
            default_volume: 20,
            version: null,
            updating: false,
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
    methods: {
        async update() {
            if(this.updating) return;
            this.updating = true;
            await $fetch("/api/software", { method: "PATCH" });
            this.updating = false;
            $fetch("/api/software").then((data) => this.version = data);
        }
    },
    async mounted() {
        this.display_name = store.get("general.display_name");
        this.default_volume = store.get("general.default_volume") || 20;
        $fetch("/api/software")
            .then((data) => this.version = data)
            .catch(() => console.warn("cant fetch version"));
    },
};
</script>

<template>
    <div class="main">
        <vtextfield v-model="display_name" title="Anzeigename" />
        <div class="title">Startlautstärke</div>
        <horizontal-slider v-model="default_volume" />
        <div class="title">Software</div>
        <template v-if="version">
            <div v-if="version.latest" class="version-latest">
                <Icon name="mdi:check-circle" color="#1ED760" />
                <div>Die Software ist auf dem aktuellsten Stand</div>
            </div>
            <div v-else class="version-update" @click="update">
                <div v-if="!updating">Update</div>
                <div v-else><loader size="16px" weight="2px" style="margin-top: -3px" />Bitte warten...</div>
            </div>
        </template>
        <template v-else>
            <div class="version-check"><loader size="16px" weight="2px" />Version wird überprüft...</div>
        </template>
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

    .version-latest {
        font-weight: lighter;
        font-size: 20px;
        color: rgb(180, 180, 180);
        margin-top: -0.5rem;
        display: flex;
        gap: 5px;
        align-items: center;

        div {
            font-size: 13px;
            padding-top: 2px;
        }
    }

    .version-update {
        padding: 5px 20px;
        margin-right: auto;
        border-radius: 5px;
        font-weight: lighter;
        margin-top: -0.5rem;
        border: 2px solid $primary;
        background: rgba(20,20,20,0.5);

        div {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }

    .version-check {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: lighter;
    }
}
</style>
