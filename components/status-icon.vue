<script>
import { Icon } from "@iconify/vue";

export default {
    name: "StatusIconComponent",
    components: {
        Icon,
    },
    props: {
        icon: { type: String, required: true },
        iconSize: { type: String, default: "1.5rem" },
        width: { type: String, default: "3rem" },
        height: { type: String, default: "3rem" },
    },
};
</script>

<template>
    <div class="status-icon" :style="{ width, height }"><Icon :icon="icon" :height="iconSize" /></div>
</template>

<style lang="scss" scoped>
.status-icon {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
