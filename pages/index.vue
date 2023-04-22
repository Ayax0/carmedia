<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "~~/framework/audio/SpotifyPlayer";

export default {
    name: "IndexPage",
    data() {
        return {
            paused: true,
            volume: 0,
            volume_prev: 0,
            volume_dialog: false,
        };
    },
    computed: {
        activeAudioPlayer() {
            return carmedia.activeAudioPlayer;
        },
        spotifyPlayer() {
            return carmedia.activeAudioPlayer as SpotifyPlayer;
        },
        isSpotify() {
            return !carmedia.activeAudioPlayer && carmedia.activeAudioPlayer instanceof SpotifyPlayer;
        },
        isActiveDevice() {
            if (!this.isSpotify) return false;
            const audioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
            return audioPlayer.activeDevice;
        },
    },
    methods: {
        updateState(state) {
            this.paused = state.paused;
        },
        up() {
            if (this.volume_dialog == false) this.volume_dialog = true;
        },
        down() {
            if (this.volume_dialog == true) this.volume_dialog = false;
        },
        left() {
            if (!this.volume_dialog && carmedia.activeAudioPlayer) carmedia.activeAudioPlayer.nextTrack();
        },
        right() {
            if (!this.volume_dialog && carmedia.activeAudioPlayer) carmedia.activeAudioPlayer.previousTrack();
        },
        swipe(event) {
            if (this.volume_dialog) {
                if (event.yPLast < 0) this.volume = this.volume + 2 > 100 ? 100 : (this.volume += 2);
                if (event.yPLast > 0) this.volume = this.volume - 2 < 0 ? 0 : (this.volume -= 2);
            }
        },
    },
    async mounted() {
        carmedia.activeAudioPlayer?.subscribe((state) => this.updateState(state));
        if (carmedia.activeAudioPlayer?.player_state) this.updateState(carmedia.activeAudioPlayer?.player_state);

        this.volume = (await $fetch("/api/volume"))["volume"];
        setInterval(async () => {
            if (this.volume_prev != this.volume) {
                try {
                    await $fetch("/api/volume", { method: "post", body: { volume: this.volume } });
                    this.volume_prev = this.volume;
                } catch (error) {
                    console.error("error updating volume");
                }
            }
        }, 500);

        this.$socket.emit("message", "hallo welt");
    },
};
</script>

<template>
    <NuxtLayout name="index">
        <template #default>
            <NuxtChild keep-alive />
            <volume-slider v-model="volume_dialog" v-model:volume="volume" />
            <swiper @swipe-up="up" @swipe-down="down" @swipe-left="left" @swipe-right="right" @swipe="swipe" />
        </template>
        <template #thumbnail>
            <div v-if="isSpotify && !isActiveDevice" v-ripple class="thumbnail-button" @click="spotifyPlayer.tranferPlayback">
                <Icon name="mdi:cellphone-sound" />
            </div>
        </template>
        <template #action>
            <vbutton icon="mdi:skip-previous" width="6rem" height="6rem" @click="activeAudioPlayer?.previousTrack()" />
            <vbutton v-if="paused" icon="mdi:play" width="6rem" height="6rem" @click="activeAudioPlayer?.play()" />
            <vbutton v-else icon="mdi:pause" width="6rem" height="6rem" @click="activeAudioPlayer?.pause()" />
            <vbutton icon="mdi:skip-next" width="6rem" height="6rem" @click="activeAudioPlayer?.nextTrack()" />
            <vbutton icon="mdi:apps" width="6rem" height="6rem" @click="navigateTo('/app')" />
        </template>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.thumbnail-button {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
