<script>
export default {
    name: "SpotifyLoginLayout",
};
</script>

<template>
    <div class="main">
        <div class="accounts">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .accounts {
        width: calc(100% - 10rem);
        height: 100%;
        display: flex;
        align-items: center;
        gap: 3rem;
        overflow-x: auto;
        box-shadow: inset 0px 0px 10px 5px $background;
        padding: 0 5rem;
    }
}
</style>
