<script>
export default {
    name: "ButtonComponent",
    props: {
        icon: { type: String, required: true },
        iconSize: { type: String, default: "2.5rem" },
        width: { type: String, default: "6rem" },
        height: { type: String, default: "8rem" },
    },
};
</script>

<template>
    <div v-ripple class="button" :style="{ width, height }"><span class="mdi" :class="icon" :style="{ 'font-size': iconSize }" /></div>
</template>

<style lang="scss" scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
