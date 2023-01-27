<script>
export default {
    name: "SpotifyModalComponent",
    props: {
        offsetx: { type: String, default: "1rem" },
        offsety: { type: String, default: "1rem" }
    }
}
</script>

<template>
    <div class="spotify-modal">
        <slot />
        <div class="modal" :style="{ bottom: `calc(100% + ${offsety})`, left: offsetx }">
            <slot name="modal" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.spotify-modal {
    position: relative;

    .modal {
        position: absolute;
        background: #181818;
        border: 1px solid #282828;
    }
}
</style>