<script lang="ts">
import imageMixin from "@/mixins/image.mixin";

export default {
    name: "SpotifyItemLayout",
    mixins: [imageMixin],
    props: {
        thumbnail: { type: Object, default: undefined },
        category: { type: String, default: undefined },
        title: { type: String, default: "Ungekannter Title" },
        info: { type: String, default: undefined },
    },
    data() {
        return {
            color: undefined,
        };
    },
    computed: {
        title_size() {
            if (this.title.length < 10) return "70px";
            if (this.title.length < 15) return "60px";
            if (this.title.length < 20) return "50px";
            return "35px";
        },
    },
    watch: {
        async thumbnail(value) {
            console.log("img", value);
            if (!value) return;
            const color = await this.getImageColor(value);
            this.color = `rgb(${color.r},${color.g},${color.b})`;
        },
    },
};
</script>

<template>
    <div class="spotify-item" :style="{ '--color-primary': this.color }">
        <div class="header">
            <div class="thumbnail"><img :src="thumbnail?.url" /></div>
            <div class="metadata">
                <div v-if="category" class="type">{{ category }}</div>
                <div class="title text-overflow" :style="{ 'font-size': title_size }">{{ title }}</div>
                <div v-if="info" class="info">{{ info }}</div>
            </div>
        </div>
        <div class="content">
            <div class="transition"></div>
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.spotify-item {
    height: 100%;
    overflow-y: auto;
    display: grid;
    grid-template-rows: 15rem auto;
    grid-template-columns: 100vw;
    background: var(--color-primary);
    color: white;

    &::-webkit-scrollbar {
        display: none;
    }

    .header {
        background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%), $noise;
        display: grid;
        padding: 2rem;
        grid-template-columns: 11rem auto;
        grid-template-rows: 100%;

        .thumbnail {
            width: 100%;
            height: 100%;
            box-shadow: $shadow-light;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .metadata {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            justify-content: flex-end;

            .type,
            .title,
            .info {
                display: flex;
                align-items: flex-end;
                padding: 0 2rem;
            }

            .type {
                text-transform: uppercase;
                font-size: 14px;
            }

            .title {
                font-weight: bold;
            }

            .info {
                font-size: 14px;
            }
        }
    }

    .content {
        position: relative;
        background: rgba(18, 18, 18);
        isolation: isolate;
        display: flex;
        flex-direction: column;

        .transition {
            background-color: var(--color-primary);
            position: absolute;
            z-index: -1;
            width: 100%;
            background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.6)), to(rgb(18, 18, 18))), $noise;
            height: 232px;
        }
    }
}
</style>
