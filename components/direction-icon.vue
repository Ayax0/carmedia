<script lang="ts">
import { Blob } from "buffer";

export default {
    name: "DirectionIconComponent",
    props: {
        name: { type: String, default: undefined },
        size: { type: String, default: "1rem" },
        color: { type: String, default: "#fff" },
    },
    watch: {
        name: {
            immediate: true,
            handler(value) {
                if (!value) return;

                $fetch("/directions/" + value + ".svg").then(async (res: Blob) => {
                    while (this.$el.firstChild) this.$el.removeChild(this.$el.firstChild);
                    const svg = <SVGElement>new DOMParser().parseFromString(await res.text(), "image/svg+xml").firstChild;
                    svg.style.width = this.size;
                    svg.style.height = this.size;
                    for (const child of svg.children) child.setAttribute("style", `fill: ${this.color}`);
                    this.$el.appendChild(svg);
                });
            },
        },
    },
};
</script>

<template>
    <div
        class="direction-icon"
        :style="{
            display: name ? 'flex' : 'none',
            '--icon-color': color,
            '--icon-size': size,
        }"
    />
</template>

<style lang="scss" scoped>
.direction-icon {
    width: var(--icon-size);
    height: var(--icon-size);

    svg {
        width: var(--icon-size);
        height: var(--icon-size);
        path {
            fill: #fff;
        }
    }
}
</style>
