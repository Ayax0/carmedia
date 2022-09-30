<script>
export default {
    name: "MenuLayout",
};
</script>

<template>
    <div class="main">
        <div class="grid">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    overflow-y: auto;

    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, $app-icon-size);
        grid-auto-rows: $app-icon-size;
        gap: 4rem;
        margin: 3rem;
    }
}
</style>
