<script lang="ts" setup>
import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";
import Setting from "@/framework/Setting";

const accounts = new Setting<Array<any>>("spotify.accounts", []);

async function login(account) {
    try {
        const activeAudioPlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
        await activeAudioPlayer.linkAccount(account);
        await activeAudioPlayer.connect();
        activeAudioPlayer.tranferPlayback();
        navigateTo("/spotify");
    } catch (error) {
        console.error("spotify login error");
        navigateTo("/app");
    }
}

onMounted(() => {
    if (accounts.value.length == 1) setTimeout(() => login(accounts.value[0]), 1000);
});
</script>

<template>
    <NuxtLayout name="spotify-login">
        <ClientOnly>
            <spotify-account v-if="accounts.value.length > 1" v-for="account in accounts.value" :account="account" @click="login(account)" />
            <div v-else class="auto-login">
                <spinner />
                <span>Sie werden automatisch eingeloggt...</span>
            </div>
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
