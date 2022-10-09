<script>
export default {
    name: "SpotifyTileComponent",
    props: {
        thumbnail: { type: String, default: "" },
        title: { type: String, default: "Unbekannt" },
        subtitle: { type: String, default: undefined },
    },
};
</script>

<template>
    <div class="tile">
        <img :src="thumbnail" />
        <div class="title text-overflow">{{ title }}</div>
        <div v-if="subtitle" class="subtitle text-overflow">{{ subtitle }}</div>
    </div>
</template>

<style lang="scss" scoped>
.tile {
    min-width: 8rem;
    border-radius: 8px;
    padding: 1rem;
    overflow: hidden;
    background: #181818;
    margin-bottom: 4rem;

    img {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
    }

    .title {
        margin-bottom: 0.2rem;
    }

    .subtitle {
        font-size: 13px;
        font-weight: 100;
        color: #ccc;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>
