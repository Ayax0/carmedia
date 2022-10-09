<script>
export default {
    name: "StatusIconComponent",
    props: {
        icon: { type: String, required: true },
        iconSize: { type: String, default: "1.5rem" },
        width: { type: String, default: "3rem" },
        height: { type: String, default: "3rem" },
    },
};
</script>

<template>
    <div class="status-icon" :style="{ width, height }"><span class="mdi" :class="icon" :style="{ 'font-size': iconSize }" /></div>
</template>

<style lang="scss" scoped>
.status-icon {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
