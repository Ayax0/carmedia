import carmedia from "@/framework";
import SpotifyPlayer from "@/framework/audio/SpotifyPlayer";
import store from "store-js";

export default defineNuxtRouteMiddleware(() => {
    if (carmedia.activeAudioPlayer && carmedia.activeAudioPlayer instanceof SpotifyPlayer) {
        const activePlayer = carmedia.activeAudioPlayer as SpotifyPlayer;
        const accounts = store.get("spotify.accounts");
        if (!accounts || accounts.length == 0) return navigateTo("/settings/spotify");
        if (!activePlayer.account) return navigateTo("/spotify/login");
    } else return navigateTo("/app");
});
