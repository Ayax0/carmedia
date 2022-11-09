<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifyLayout",
    data() {
        return {
            account: undefined,
            thumbnail: undefined,
            song: "-",
            artist: "Unbekannter Interpret",
            progress: 0,
            trackPosition: "0:00",
            trackLength: "0:00",
            paused: true,
        };
    },
    methods: {
        updateState(state) {
            this.thumbnail = state.track?.thumbnail;
            this.song = state.track?.name || "-";
            this.artist = state.track?.artists?.join(", ") || "Unbekannter Interpret";
            this.paused = state.paused;
            this.trackLength = this.formatMillis(state.track?.length);
        },
        previous() {
            carmedia.activeAudioPlayer?.previousTrack();
        },
        pause() {
            carmedia.activeAudioPlayer?.pause();
        },
        play() {
            carmedia.activeAudioPlayer?.play();
        },
        next() {
            carmedia.activeAudioPlayer?.nextTrack();
        },
        seek(event) {
            if (carmedia.activeAudioPlayer instanceof SpotifyPlayer) {
                const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;

                if(!activeAudioPlayer) return;
                if(!activeAudioPlayer.player_state) return;
                if(!activeAudioPlayer.player_state.track) return;
                
                const trackLength = activeAudioPlayer.player_state.track?.length;
                activeAudioPlayer.seek((trackLength / event.target.clientWidth) * event.offsetX);
            }
        },
        formatMillis(millis) {
            if(!millis) millis = 0;
            const positionMinutes = Math.floor(millis / 60000);
            const positionSeconds = Math.round((millis % 60000) / 1000);
            return `${positionMinutes}:${positionSeconds.toLocaleString("de-CH", { minimumIntegerDigits: 2, useGrouping: false })}`;
        }
    },
    async mounted() {
        if (carmedia.activeAudioPlayer instanceof SpotifyPlayer) {
            const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
            this.account = activeAudioPlayer.account;

            activeAudioPlayer.subscribe((state) => this.updateState(state));
            if (activeAudioPlayer.player_state) this.updateState(activeAudioPlayer.player_state);

            setInterval(() => {
                if (!activeAudioPlayer) return;
                if (!activeAudioPlayer.player_state) return;

                const paused = activeAudioPlayer.player_state.paused;
                const trackLength = activeAudioPlayer.player_state.track?.length;
                const lastPosition = activeAudioPlayer.player_state.position;
                const timeDifference = Date.now() - activeAudioPlayer.player_state.timestamp;

                if (!paused) {
                    this.trackPosition = this.formatMillis(lastPosition + timeDifference);
                    this.progress = (100 / trackLength) * (lastPosition + timeDifference);
                }
            }, 1000);
        } else navigateTo("/app");
    },
};
</script>

<template>
    <div class="main">
        <div class="header">
            <div class="spotify" @click="navigateTo('/app')"><Icon name="mdi:apps" style="margin-left: -5px" /></div>
            <div class="spacer"></div>
            <div class="home-button" @click="navigateTo('/spotify')"><Icon name="mdi:home" /></div>
            <div class="search-input">
                <span><Icon name="mdi:magnify" /></span>
                <input type="text" placeholder="Was möchtest du hören?" />
            </div>
            <div class="spacer"></div>
            <div v-if="account" v-ripple class="account" @click="navigateTo('/spotify/login')">
                <img v-if="account.images[0]" :src="account.images[0]?.url" />
                <p v-else>{{ account.display_name.charAt(0) }}</p>
            </div>
        </div>
        <div class="content">
            <slot />
        </div>
        <div class="control">
            <div class="thumbnail" :style="{ 'background-image': thumbnail ? `url(${thumbnail})` : '' }" />
            <div class="info">
                <div class="song text-overflow">{{ song }}</div>
                <div class="artist text-overflow">{{ artist }}</div>
            </div>
            <div class="player">
                <div v-ripple class="button" @click="previous"><Icon name="mdi:skip-previous" /></div>
                <div v-ripple class="button"  @click="paused ? play() : pause()">
                    <Icon v-if="paused" name="mdi:play-circle" />
                    <Icon v-else name="mdi:pause-circle" />
                </div>
                <div v-ripple class="button" @click="next"><Icon name="mdi:skip-next" /></div>
            </div>
            <div class="action">
                <div v-ripple class="button">
                    <Icon name="mdi:cast-audio" />
                    <div class="dialog">
                        <div>Test</div>
                    </div>
                </div>
            </div>
            <div class="progress" :style="{ '--player-progress': `${progress}%` }">
                <div>{{ trackPosition }}</div>
                <div class="slider" @click="seek"><div class="track" /></div>
                <div>{{ trackLength }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 4rem calc(100% - 10rem) 6rem;
    grid-template-columns: 100vw;
    background: #121212;

    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        padding: 0 2rem;
        gap: 1rem;

        .spotify {
            font-size: 2.5rem;
        }

        .home-button {
            background: #242424;
            width: 3rem;
            height: 3rem;
            font-size: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 1.5rem;
        }

        .search-input {
            height: 3rem;
            width: 20rem;
            background: #242424;
            color: #ccc;
            border-radius: 1.5rem;
            display: flex;

            span {
                font-size: 2rem;
                height: 3rem;
                width: 3rem;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                border-radius: 1.5rem 0 0 1.5rem;
            }

            input {
                width: calc(100% - 3rem);
                color: #ccc;
                border: none;
                border-radius: 0 1.5rem 1.5rem 0;
                background: transparent;
                font-weight: 100;
                padding: 0 1.5rem 0 0.5rem;
            }

            input:focus {
                outline: none;
            }
        }

        .account {
            width: 3rem;
            height: 3rem;
            border-radius: 1.5rem;
            background: #242424;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: calc(100% - 15px);
                height: calc(100% - 15px);
                border-radius: 50%;
            }

            p {
                font-size: 20px;
                font-weight: 100;
            }
        }
    }

    .control {
        background: #181818;
        border-top: 1px solid #282828;
        display: grid;
        grid-template-areas: 
            "thumbnail info     player   action"
            "thumbnail progress progress progress";
        grid-template-columns: 5rem calc(50% - 11rem) 12rem calc(50% - 6rem);
        grid-template-rows: 3rem 1rem;
        padding: 1rem;
        z-index: 10;

        .thumbnail {
            grid-area: thumbnail;
            background-repeat: no-repeat;
            background-size: contain;
            width: 4rem;
            height: 4rem;
        }

        .info {
            grid-area: info;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .song {
                font-size: 14px;
            }
            .artist {
                font-size: 12px;
                font-weight: lighter;
                color: #ccc;
            }
        }

        .player {
            grid-area: player;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
            margin-top: -1rem;

            .button {
                display: flex;
                justify-content: center;
                align-items: center;
                height: calc(100% - 1.5rem);
                padding: 0.5rem;
                padding-top: 1rem;
            }
        }

        .action {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 20px;
            margin-top: -1rem;

            .button {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                height: calc(100% - 1.5rem);
                padding: 0.5rem;
                padding-top: 1rem;

                .dialog {
                    width: 200px;
                    min-height: 2rem;
                    max-height: 2rem;
                    background: #282828;
                    box-shadow: $shadow;
                    position: absolute;
                    bottom: calc(100% + 15px);
                    right: 0;
                    z-index: 100;
                    border-radius: 5px;
                    padding: 5px;
                    display: none;

                    &::after {
                        content: "";
                        position: absolute;
                        background: #282828;
                        top: calc(100% - 5px);
                        right: 10px;
                        height: 10px;
                        width: 10px;
                        transform: rotate(45deg);
                        z-index: 99;
                    }
                }
            }
        }

        .progress {
            grid-area: progress;
            display: flex;
            font-size: 10px;
            font-weight: lighter;
            align-items: center;
            gap: 0.5rem;

            .slider {
                position: relative;
                flex: 1;
                height: 4px;
                border-radius: 2px;
                background: #5E5E5E;

                .track {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 4px;
                    width: var(--player-progress);
                    background: white;
                    border-radius: 2px;
                    transition: width 1s ease;
                }
            }
        }
    }
}
</style>
