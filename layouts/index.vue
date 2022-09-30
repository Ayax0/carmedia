<script>
export default {
    name: "IndexLayout",
    props: {
        progress: { type: Number, default: 0 },
        thumbnail: { type: String, default: "" },
        song: { type: String, default: "-" },
        artist: { type: String, default: "Unbekannter Interpret" },
    },
};
</script>

<template>
    <div class="main">
        <div class="content">
            <slot />
        </div>
        <div class="timeline"><div class="thumb" :style="{ '--prog': progress + '%' }" /></div>
        <div class="control">
            <div class="thumbnail" :style="{ 'background-image': `url(${thumbnail})` }"></div>
            <div class="info">
                <div class="song text-overflow">{{ song }}</div>
                <div class="artist text-overflow">{{ artist }}</div>
            </div>
            <div class="action"><slot name="action" /></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: auto 5px 8rem;

    .timeline {
        background: rgba(0, 0, 0, 0.5);

        .thumb {
            background: white;
            height: 100%;
            width: var(--prog);
            min-width: 5px;
            max-width: 100%;
        }
    }
    .control {
        background: $background;
        display: grid;
        grid-template-columns: 8rem auto 25rem;

        .thumbnail {
            margin: 1rem;
            background-repeat: no-repeat;
            background-size: contain;
            box-shadow: $shadow;
        }

        .info {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .song {
                font-size: 22px;
                font-weight: bold;
                white-space: initial;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }

            .artist {
                font-size: 13px;
                font-weight: lighter;
            }
        }

        .action {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-left: 1rem;
        }
    }
}
</style>
