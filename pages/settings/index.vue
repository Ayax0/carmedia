<script setup>
import { Setting } from "@/utils/settings";

var display_name = new Setting("general.display_name");
var default_volume = new Setting("general.default_volume", 20);
var branch = ref(new Setting("general.software_branch", "origin/master"));

const { data: branches } = await useFetch("/api/software/branch");

const software_update = ref({ pending: false, error: false });

function updateSoftware() {
    if(software_update.value.pending) return;

    software_update.value.pending = true;
    $fetch("/api/software/update", { method: "POST", body: { branch: branch.value.value } })
    .then(() => {
        software_update.value.pending = false;
        software_update.value.error = false;
    })
    .catch(() => {
        software_update.value.pending = false;
        software_update.value.error = true;
    })
}

function restartDevice() {
    $fetch("/api/hardware/restart", { method: "POST" });
}
</script>

<template>
    <div class="main">
        <vtextfield v-model="display_name.value" title="Anzeigename" />
        <div class="title">Startlautstärke</div>
        <horizontal-slider v-model="default_volume.value" />
        <div class="title">Software</div>
        <ClientOnly>
            <template v-if="branches">
                <vselect v-model="branch.value" :items="branches.all" />
                <div v-if="branches.version == branches.branches[branch.value].commit" class="version-latest">
                    <Icon name="mdi:check-circle" color="#1ED760" />
                    <div>Die Software ist auf dem aktuellsten Stand</div>
                </div>
                <div v-else class="version-update" @click="updateSoftware">
                    <div v-if="software_update.pending"><loader size="16px" weight="2px" style="margin-top: -3px" />Bitte warten...</div>
                    <div v-else>Update</div>
                </div>
            </template>
        </ClientOnly>
        <div class="title">Erweiterte Funktionen</div>
        <button v-ripple @click="restartDevice">Gerät neustarten</button>
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
        margin-bottom: -0.5rem;
    }

    .version-latest {
        font-weight: lighter;
        font-size: 20px;
        color: rgb(180, 180, 180);
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
        border: 2px solid $primary;
        background: rgba(20,20,20,0.5);

        div {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }
}

button {
    padding: 10px 20px;
    border-radius: 5px;
    border: 2px solid $primary;
    background: transparent;
    color: white;
    font-size: 16px;
}
</style>
