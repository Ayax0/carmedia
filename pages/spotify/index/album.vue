<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifyAlbumPage",
    data() {
        return {
            album: undefined,
        };
    },
    computed: {
        album_id() {
            return this.$route.query.id;
        },
        thumbnail() {
            return this.album?.images[0] || { url: "" };
        },
    },
    mounted() {
        const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
        activeAudioPlayer.api.instance
            .get("/albums/" + this.album_id)
            .then((res) => (this.album = res.data))
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
            if (!this.album) return;
            if (!track) return;

            const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
            activeAudioPlayer.api.instance
                .put("/me/player/play", {
                    context_uri: this.album.uri,
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
    <NuxtLayout name="spotify-item" :thumbnail="thumbnail" category="Album" :title="album?.name" :info="album?.owner?.display_name">
        <div class="playlist-body">
            <table>
                <tr>
                    <th>#</th>
                    <th>Titel</th>
                    <th><Icon name="mdi:clock-outline" /></th>
                </tr>
                <tr v-for="(item, index) in album?.tracks?.items" v-ripple @click="playTrack(item.track)">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <div class="track-info">
                            <div class="title text-overflow">{{ item.name }}</div>
                            <div class="subtitle text-overflow">{{ item.artists?.map((artist) => artist.name)?.join(", ") }}</div>
                        </div>
                    </td>
                    <td>{{ formatDuration(item.duration_ms) }}</td>
                </tr>
            </table>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.playlist-body {
    padding-bottom: 1rem;

    table {
        width: 100%;
        border-spacing: 0;
        padding: 0 2rem;
        color: #ccc;
        border-spacing: 0 1rem;

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
            padding: 0 0.5rem;
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
        display: flex;
        flex-direction: column;
        align-items: center;

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
