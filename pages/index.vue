<script lang="ts">
import carmedia from "@/framework";

export default {
    name: "IndexPage",
    data() {
        return {
            paused: true,
        };
    },
    computed: {
        activeAudioPlayer() {
            return carmedia.activeAudioPlayer;
        },
    },
    methods: {
        updateState(state) {
            this.paused = state.paused;
        },
    },
    mounted() {
        carmedia.activeAudioPlayer?.subscribe((state) => this.updateState(state));
        if (carmedia.activeAudioPlayer?.player_state) this.updateState(carmedia.activeAudioPlayer?.player_state);
    },
};
</script>

<template>
    <NuxtLayout name="index">
        <template #default>
            <NuxtChild />
        </template>
        <template #action>
            <vbutton icon="mdi-skip-previous" @click="activeAudioPlayer?.previousTrack()" />
            <vbutton v-if="paused" icon="mdi-play" @click="activeAudioPlayer?.play()" />
            <vbutton v-else icon="mdi-pause" @click="activeAudioPlayer?.pause()" />
            <vbutton icon="mdi-skip-next" @click="activeAudioPlayer?.nextTrack()" />
            <vbutton icon="mdi-apps" @click="navigateTo('/app')" />
        </template>
    </NuxtLayout>
</template>
