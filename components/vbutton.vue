<script>
export default {
    name: "ButtonComponent",
    props: {
        icon: { type: String, required: true },
        iconSize: { type: String, default: "2.5rem" },
        width: { type: String, default: "auto" },
        height: { type: String, default: "auto" },
    },
};
</script>

<template>
    <div v-ripple class="button" :style="{ width, height }"><Icon :name="icon" :size="iconSize" /><slot /></div>
</template>

<style lang="scss" scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}
</style>
