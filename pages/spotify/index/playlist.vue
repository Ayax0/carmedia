<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

import imageMixin from "@/mixins/image.mixin";

export default {
    name: "SpotifyPlaylistPage",
    mixins: [imageMixin],
    data() {
        return {
            playlist: undefined,
            color: undefined,
        };
    },
    computed: {
        playlist_id() {
            return this.$route.query.id;
        },
    },
    mounted() {
        const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
        activeAudioPlayer.api.instance
            .get("/playlists/" + this.playlist_id)
            .then((res) => (this.playlist = res.data))
            .then(async () => {
                const color = await this.getImageColor(this.playlist.images[0]);
                this.color = `rgb(${color.r},${color.g},${color.b})`;
            });
    },
};
</script>

<template>
    <div class="playlist-main" :style="{ '--color-primary': this.color }">
        <div class="header"></div>
        <div class="content">{{ color }}</div>
    </div>
</template>

<style lang="scss" scoped>
.playlist-main {
    height: 100%;
    overflow-y: auto;
    display: grid;
    grid-template-rows: 15rem calc(100% - 15rem);
    grid-template-columns: 100vw;
    background: var(--color-primary);
    color: white;

    &::-webkit-scrollbar {
        display: none;
    }

    .header {
        backdrop-filter: saturate(150%) brightness(120%);
        box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 5rem -28px inset;
    }

    .content {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0, #121212 10rem);
    }
}
</style>
