<script lang="ts">
import carmedia from "@/framework";
import imageMixin from "~~/mixins/image.mixin";

export default {
    name: "IndexLayout",
    mixins: [imageMixin],
    data() {
        return {
            thumbnail: null,
            song: "-",
            artist: "Unbekannter Interpret",
            progress: 0,
            color: "rgb(13, 13, 13)",
        };
    },
    methods: {
        updateState(state) {
            this.thumbnail = state.track?.thumbnail;
            this.song = state.track?.name || "-";
            this.artist = state.track?.artists?.join(", ") || "Unbekannter Interpret";
            this.getImageColor(state.track?.thumbnail).then((c) => (this.color = `rgb(${c.r},${c.g},${c.b})`));
        },
    },
    mounted() {
        carmedia.activeAudioPlayer?.subscribe((state) => this.updateState(state));
        if (carmedia.activeAudioPlayer?.player_state) this.updateState(carmedia.activeAudioPlayer?.player_state);

        setInterval(() => {
            if (!carmedia.activeAudioPlayer) return;
            if (!carmedia.activeAudioPlayer.player_state) return;

            const paused = carmedia.activeAudioPlayer.player_state.paused;
            const trackLength = carmedia.activeAudioPlayer.player_state.track?.length;
            const lastPosition = carmedia.activeAudioPlayer.player_state.position;
            const timeDifference = Date.now() - carmedia.activeAudioPlayer.player_state.timestamp;

            if (!paused) this.progress = (100 / trackLength) * (lastPosition + timeDifference);
        }, 1000);
    },
};
</script>

<template>
    <div class="main">
        <div class="content">
            <slot />
        </div>
        <div class="timeline"><div class="thumb" :style="{ '--prog': progress + '%' }" /></div>
        <div class="control" :style="{ '--color': color }">
            <div class="thumbnail" :style="{ 'background-image': thumbnail ? `url(${thumbnail})` : '' }">
                <slot name="thumbnail" />
            </div>
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
    grid-template-rows: auto 5px 6rem;

    .content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .timeline {
        background: rgba(0, 0, 0, 0.5);

        .thumb {
            background: white;
            height: 100%;
            width: var(--prog);
            min-width: 5px;
            max-width: 100%;
            transition: width 1s ease;
        }
    }
    .control {
        background: linear-gradient(to right, var(--color) 0%, #0d0d0d 50%, #161616 100%);
        display: grid;
        grid-template-columns: 6rem calc(100vw - 6rem - 25rem) 25rem;
        grid-template-rows: 100%;

        .thumbnail {
            background-repeat: no-repeat;
            background-size: contain;
            box-shadow: $shadow;
        }

        .info {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 1rem;

            .song {
                font-size: 22px;
                font-weight: bold;
                white-space: initial;
                display: -webkit-box;
                -webkit-line-clamp: 2;
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
