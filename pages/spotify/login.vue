<script lang="ts">
import store from "store-js";
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";

export default {
    name: "SpotifyLoginPage",
    data() {
        return {
            auto_login: false,
        };
    },
    computed: {
        accounts() {
            return store.get("spotify.accounts");
        },
    },
    methods: {
        async login(account) {
            if (carmedia.activeAudioPlayer instanceof SpotifyPlayer) {
                const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
                await activeAudioPlayer.linkAccount(account);
                await activeAudioPlayer.connect();
                await activeAudioPlayer.tranferPlayback();

                navigateTo("/spotify");
            } else navigateTo("/app");
        },
    },
    mounted() {
        if (this.accounts && this.accounts.length == 1) {
            this.auto_login = true;
            setTimeout(() => this.login(this.accounts[0]), 1000);
        }
    },
};
</script>

<template>
    <NuxtLayout name="spotify-login">
        <ClientOnly>
            <div v-if="auto_login" class="auto-login">
                <spinner />
                <span>Sie werden automatisch eingeloggt...</span>
            </div>
            <spotify-account v-else v-for="account in accounts" :account="account" @click="login(account)" />
        </ClientOnly>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.auto-login {
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}
</style>
