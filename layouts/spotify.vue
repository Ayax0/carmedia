<script lang="ts">
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifyLayout",
    data() {
        return {
            account: undefined,
        };
    },
    async mounted() {
        if (carmedia.activeAudioPlayer instanceof SpotifyPlayer) {
            const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
            this.account = activeAudioPlayer.account;
            activeAudioPlayer.api.instance.get("/me/player/recently-played?limit=4").then((res) => (this.recently_played = res.data));
        } else navigateTo("/app");
    },
};
</script>

<template>
    <div class="main">
        <div class="header">
            <div class="spotify" @click="navigateTo('/app')"><span class="mdi mdi-apps"></span></div>
            <div class="spacer"></div>
            <div class="home-button" @click="navigateTo('/spotify')"><span class="mdi mdi-home"></span></div>
            <div class="search-input">
                <span class="mdi mdi-magnify"></span>
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
    </div>
</template>

<style lang="scss" scoped>
.main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 4rem calc(100% - 4rem);
    grid-template-columns: 100vw;
    background: #121212;

    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        padding: 0 1rem;
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
}
</style>
