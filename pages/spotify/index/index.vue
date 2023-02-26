<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifyIndexPage",
    data() {
        return {
            playlists: undefined,
            shows: undefined,
            featured: undefined,
        };
    },
    mounted() {
        const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;

        activeAudioPlayer.api.instance.get("/me/playlists?limit=50").then((res) => (this.playlists = res.data));
        activeAudioPlayer.api.instance.get("/me/shows?limit=50").then((res) => (this.shows = res.data));
        activeAudioPlayer.api.instance.get("/browse/featured-playlists").then((res) => (this.featured = res.data));
    },
};
</script>

<template>
    <div class="spotify-main">
        <template v-if="playlists && playlists.items && playlists.items.length > 0">
            <div class="title">Deine Playlists</div>
            <div class="category">
                <spotify-tile
                    color="linear-gradient(135deg, #470ef5 0%, #8D8CE5 100%)"
                    icon="mdi:bookmark"
                    title="Lieblingssongs"
                    @click="navigateTo('/spotify/liked')"
                />
                <spotify-tile
                    v-for="item in playlists.items"
                    :thumbnail="item.images[0]?.url"
                    :title="item.name"
                    :subtitle="item.owner?.display_name"
                    @click="navigateTo('/spotify/playlist?id=' + item.id)"
                />
            </div>
        </template>
        <template v-if="shows && shows.items && shows.items.length > 0">
            <div class="title">Deine Shows</div>
            <div class="category">
                <spotify-tile
                    v-for="item in shows.items"
                    :thumbnail="item.show?.images[0]?.url"
                    :title="item.show?.name"
                    :subtitle="item.show?.publisher"
                    @click="navigateTo('/spotify/show?id=' + item.show.id)"
                />
            </div>
        </template>
        <template v-if="featured && featured.playlists && featured.playlists.items && featured.playlists.items.length > 0">
            <div class="title">Von Spotify empfohlen</div>
            <div class="category">
                <spotify-tile
                    v-for="item in featured.playlists.items"
                    :thumbnail="item.images[0]?.url"
                    :title="item.name"
                    :subtitle="item.owner?.display_name"
                    @click="navigateTo('/spotify/playlist?id=' + item.id)"
                />
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.spotify-main {
    height: 100%;
    overflow-y: auto;
    padding: 1.5rem 0;

    &::-webkit-scrollbar {
        display: none;
    }
    .title {
        grid-area: header;
        font-size: 22px;
        padding: 0 2.5rem;
    }

    .category {
        display: flex;
        gap: 1.5rem;
        overflow-x: auto;
        padding: 2rem 2rem;
        margin-top: -1rem;
        margin-bottom: -4rem;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .category:last-of-type .tile {
        margin-bottom: 2rem;
    }
}
</style>
