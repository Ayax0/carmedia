<script>
import carmedia from "@/framework";

export default {
    name: "AppIconComponent",
    props: {
        app: { type: Object, required: true },
    },
    methods: {
        click() {
            carmedia.openApplication(this.app);
        },
    },
};
</script>

<template>
    <div v-ripple class="application" :style="{ 'background-image': app ? `url(${app.thumbnail})` : '' }" @click="click">
        <div class="label text-overflow">{{ app.name }}</div>
    </div>
</template>

<style lang="scss" scoped>
.application {
    position: relative;
    box-shadow: $shadow;
    border-radius: 1rem;
    background-size: cover;
    background-position: center;

    .label {
        position: absolute;
        top: calc(100% + 1rem);
        left: 0;
        width: 100%;
        text-align: center;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>
