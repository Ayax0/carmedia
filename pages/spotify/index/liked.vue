<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifyLikedPage",
    data() {
        return {
            liked: undefined,
        };
    },
    mounted() {
        const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
        activeAudioPlayer.api.instance
            .get("/me/tracks?limit=50")
            .then((res) => (this.liked = res.data))
            .catch((error) => console.log(error));
    },
    methods: {
        formatDuration(duration_ms) {
            const total = Math.round(duration_ms / 1000);
            const minutes = Math.floor(total / 60);
            const seconds = total - minutes * 60;
            return `${minutes}:${seconds.toLocaleString("de-CH", { minimumIntegerDigits: 2 })}`;
        },
        playTrack(track) {
            if (!this.liked) return;
            if (!track) return;

            const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
            activeAudioPlayer.api.instance
                .put("/me/player/play", {
                    uris: this.liked.items?.map((item) => item.track?.uri),
                    offset: { uri: track.uri },
                })
                .then(() => console.log("start playing track"))
                .catch((error) => console.log(error.response))
                .then(() => {
                    navigateTo("/");
                });
        },
    },
};
</script>

<template>
    <NuxtLayout name="spotify-item" thumbnailColor="linear-gradient(135deg, #470ef5 0%, #8D8CE5 100%)" tileColor="#470ef5" icon="mdi:bookmark" category="Playlist" title="Lieblingssongs">
        <div class="playlist-body">
            <table>
                <tr>
                    <th>#</th>
                    <th>Titel</th>
                    <th><Icon name="mdi:clock-outline" /></th>
                </tr>
                <tr v-for="(item, index) in liked?.items" v-ripple @click="playTrack(item.track)">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <div class="track-info">
                            <img :src="item.track?.album?.images[0]?.url || ''" />
                            <div class="title text-overflow">{{ item.track?.name }}</div>
                            <div class="subtitle text-overflow">{{ item.track?.artists.map((artist) => artist.name)?.join(", ") }}</div>
                        </div>
                    </td>
                    <td>{{ formatDuration(item.track?.duration_ms) }}</td>
                </tr>
            </table>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.playlist-body {
    padding-bottom: 2rem;

    table {
        width: 100%;
        border-spacing: 0;
        padding: 0 2rem;
        color: #ccc;

        tr > :nth-child(1) {
            text-align: center;
        }

        tr > :nth-child(2) {
            text-align: left;
            max-width: 80vw;
        }

        tr > :nth-child(3) {
            text-align: right;
        }

        th,
        td {
            font-weight: 100;
            font-size: 14px;
            padding: 1rem 0.5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        th {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 0.5rem;
        }
    }

    .track-info {
        display: grid;
        grid-template-areas:
            "image title"
            "image subtitle";
        grid-template-columns: 3rem calc(100% - 3rem);
        grid-template-rows: 1.5rem 1.5rem;

        img {
            grid-area: image;
            width: 3rem;
            height: 3rem;
        }

        .title,
        .subtitle {
            padding: 0 1rem;
            width: 100%;
        }

        .title {
            font-size: 16px;
            color: white;
        }

        .subtitle {
            font-size: 13px;
        }
    }
}
</style>
