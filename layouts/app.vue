<script>
export default {
    name: "MenuLayout",
};
</script>

<template>
    <div class="main">
        <div class="header"><slot name="header" /></div>
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
    display: grid;
    grid-template-rows: 3rem calc(100% - 3rem);

    .header {
        background: rgba(20,20,20,0.5);
        box-shadow: $shadow;
        display: flex;
        align-items: center;
    }

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
