<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifyShowPage",
    data() {
        return {
            show: undefined,
        };
    },
    computed: {
        show_id() {
            return this.$route.query.id;
        },
        thumbnail() {
            return this.show?.images[0] || { url: "" };
        },
    },
    mounted() {
        const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
        activeAudioPlayer.api.instance
            .get("/shows/" + this.show_id)
            .then((res) => (this.show = res.data))
            .then(() => console.log(this.show))
            .catch((error) => console.log(error));
    },
    methods: {
        formatDuration(duration_ms) {
            const total = Math.round(duration_ms / 1000);
            const minutes = Math.floor(total / 60);
            const seconds = total - minutes * 60;
            return `${minutes}:${seconds.toLocaleString("de-CH", { minimumIntegerDigits: 2 })}`;
        },
        playEpisode(track) {
            if (!this.show) return;
            if (!track) return;

            const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
            activeAudioPlayer.api.instance
                .put("/me/player/play", {
                    context_uri: this.show.uri,
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
    <NuxtLayout name="spotify-item" :thumbnail="thumbnail" category="Podcast" :title="show?.name" :info="show?.publisher">
        <div class="show-body">
            <div class="episode" v-for="episode in show?.episodes?.items">
                <img :src="episode.images[0].url" />
                <div class="episode-info">
                    <div class="episode-title text-overflow">{{ episode.name }}</div>
                    <div class="episode-description text-overflow">{{ episode.description }}</div>
                    <div class="episode-status">
                        <span v-ripple @click="playEpisode(episode)"><Icon name="mdi:play-circle" size="35px" style="color: white" /></span>
                        <div v-if="episode.resume_point?.fully_played">
                            Abgespielt
                            <Icon name="mdi:check" size="22px" style="color: #1DB954" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.show-body {
    display: flex;
    flex-direction: column;

    .episode {
        display: grid;
        grid-template-columns: 8rem auto;
        grid-template-rows: 10rem;
        padding: 0 1rem;

        img {
            width: 6rem;
            height: 6rem;
            margin: auto;
            border-radius: 10px;
        }

        .episode-info {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            justify-content: center;
            height: 8rem;
            margin: auto 0;
            padding: 0 1rem;

            .episode-title {
                font-size: 16px;
                font-weight: bold;
                color: white;
            }

            .episode-description {
                font-size: 14px;
                font-weight: 100;
                color: #ccc;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                white-space: unset;
            }

            .episode-status {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-size: 13px;
                color: #ccc;

                span {
                    border-radius: 50%;
                }

                div {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            }
        }
    }
}
</style>
