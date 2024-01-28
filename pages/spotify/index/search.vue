<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifySearchPage",
    data() {
        return {
            result: undefined,
        };
    },
    computed: {
        query() {
            return this.$route.query.query;
        },
    },
    watch: {
        query: {
            immediate: true,
            handler(value) {
                const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
                activeAudioPlayer.api.instance
                    .get("/search", { params: {
                        q: value,
                        type: ["album", "artist", "playlist", "track", "show"].join(),
                        market: "CH"
                    } })
                    .then((res) => this.result = res.data)
                    .then(() => console.log(this.result))
                    .catch(() => console.warn("could not fetch search result"));
            }
        }
    },
    methods: {
        formatDuration(duration_ms) {
            const total = Math.round(duration_ms / 1000);
            const minutes = Math.floor(total / 60);
            const seconds = total - minutes * 60;
            return `${minutes}:${seconds.toLocaleString("de-CH", { minimumIntegerDigits: 2 })}`;
        },
        playTrack(track, context) {
            if (!track) return;
            if (!context) return;

            const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
            activeAudioPlayer.api.instance
                .put("/me/player/play", {
                    context_uri: context,
                    offset: { uri: track },
                })
                .then(() => console.log("start playing track"))
                .catch((error) => console.log(error.response))
                .then(() => {
                    navigateTo("/spotify");
                });
        },
    }
};
</script>

<template>
    <div class="search-main">
        <template v-if="result">
            <div class="top-result">
                <div class="title">Top-Ergebnis</div>
                <div class="top-artist">
                    <div class="avatar" :style="{ 'background-image': `url(${result.artists?.items[0]?.images[0]?.url})` }"></div>
                    <div class="name text-overflow">{{ result.artists?.items[0]?.name }}</div>
                    <div class="genre text-overflow">{{ result.artists?.items[0]?.genres?.join(', ') }}</div>
                </div>
            </div>
            <div class="song-result">
                <div class="title">Songs</div>
                <table>
                    <tr v-for="item in result.tracks?.items?.slice(0,4)" v-ripple @click="playTrack(item.uri, item.album?.uri)">
                        <td><div class="avatar" :style="{ 'background-image': `url(${item.album?.images[0]?.url})` }"></div></td>
                        <td>
                            <div class="name text-overflow">{{ item.name }}</div>
                            <div class="artists text-overflow">{{ item.artists.map((artist) => artist.name)?.join(", ") }}</div>
                        </td>
                        <td>{{ formatDuration(item.duration_ms) }}</td>
                    </tr>
                </table>
            </div>
            <div class="list-result">
                <template v-if="result.artists && result.artists.items && result.artists.items.length > 0">
                    <div class="title">Künstler*innen</div>
                    <div class="category">
                        <spotify-tile
                            v-for="item in result.artists.items"
                            :thumbnail="item.images[0]?.url"
                            :title="item.name"
                            :subtitle="item.genres.join(', ')"
                            rounded
                        />
                    </div>
                </template>
                <template v-if="result.albums && result.albums.items && result.albums.items.length > 0">
                    <div class="title">Alben</div>
                    <div class="category">
                        <spotify-tile
                            v-for="item in result.albums.items"
                            :thumbnail="item.images[0]?.url"
                            :title="item.name"
                            :subtitle="item.artists?.map((artist) => artist.name)?.join(', ')"
                            @click="navigateTo('/spotify/album?id=' + item.id)"
                        />
                    </div>
                </template>
                <template v-if="result.playlists && result.playlists.items && result.playlists.items.length > 0">
                    <div class="title">Playlists</div>
                    <div class="category">
                        <spotify-tile
                            v-for="item in result.playlists.items"
                            :thumbnail="item.images[0]?.url"
                            :title="item.name"
                            :subtitle="'von ' + item.owner?.display_name"
                            @click="navigateTo('/spotify/playlist?id=' + item.id)"
                        />
                    </div>
                </template>
                <template v-if="result.tracks && result.tracks.items && result.tracks.items.length > 0">
                    <div class="title">Songs</div>
                    <div class="category">
                        <spotify-tile
                            v-for="item in result.tracks.items"
                            :thumbnail="item.album?.images[0]?.url"
                            :title="item.name"
                            :subtitle="item.artists?.map((artist) => artist.name).join(', ')"
                            @click="playTrack(item.uri, item.album?.uri)"
                        />
                    </div>
                </template>
                <template v-if="result.shows && result.shows.items && result.shows.items.length > 0">
                    <div class="title">Podcasts</div>
                    <div class="category">
                        <spotify-tile
                            v-for="item in result.shows.items"
                            :thumbnail="item.images[0]?.url"
                            :title="item.name"
                            :subtitle="item.publisher"
                            @click="navigateTo('/spotify/show?id=' + item.id)"
                        />
                    </div>
                </template>
            </div>
        </template>
        <div v-else class="empty">Kein Ergebnis auf diese Suche</div>
    </div>
</template>

<style lang="scss" scoped>
.search-main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-areas:
        "top-result  song-result"
        "list-result list-result";
    grid-template-columns: 18rem calc(100% - 23rem);
    grid-template-rows: 16.5rem auto;
    overflow: hidden;
    overflow-y: auto;
    padding: 1rem 2rem 0 2rem;
    column-gap: 2rem;
    row-gap: 2rem;

    .top-result {
        grid-area: top-result;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .top-artist {
            flex: 1;
            background: #181818;
            border-radius: 8px;

            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 1rem;

            .avatar {
                width: 8rem;
                height: 8rem;
                border-radius: 4rem;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                overflow: hidden;
                box-shadow: $shadow;
            }

            .name {
                font-size: 28px;
                margin-top: auto;
            }

            .genre {
                font-size: 13px;
                font-weight: lighter;
                color: #ccc;
                margin-top: -5px;
            }
        }
    }

    .song-result {
        grid-area: song-result;
        width: 100%;
        max-width: 100%;

        table {
            border-spacing: 0;
            padding-top: 1rem;
            table-layout: fixed;
            width: 100%;

            color: #ccc;
            font-size: 13px;

            tr > :nth-child(1) {
                text-align: left;
                width: 3.5rem;
            }

            tr > :nth-child(2) {
                text-align: left;
            }

            tr > :nth-child(3) {
                text-align: right;
                width: 3.5rem;
            }

            td {
                font-weight: 100;
                padding: 0.5rem 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .avatar {
                width: 2.5rem;
                height: 2.5rem;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }

            .name {
                font-size: 15px;
                color: white;
            }
        }
    }

    .list-result {
        grid-area: list-result;

        .category {
            display: flex;
            gap: 1.5rem;
            overflow-x: auto;
            padding: 2rem 2rem 1rem 2rem;
            margin: -1rem -2rem 1rem -2rem;
            align-items: stretch;

            .tile {
                margin-bottom: 0rem;
            }

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }

    .title {
        font-size: 20px;
    }

    .empty {
        padding: 0 2rem;
        font-weight: lighter;
    }
}
</style>
