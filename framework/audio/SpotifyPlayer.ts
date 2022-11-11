import AudioPlayer from "./AudioPlayer";
import store from "store-js";
import SpotifyAPI from "@/api/spotify";

export default class SpotifyPlayer extends AudioPlayer {
    api: SpotifyAPI;
    player: Spotify.Player;
    account: SpotifyAccount;
    device: Spotify.WebPlaybackInstance;
    activeDevice: boolean;

    constructor() {
        super();

        this.api = new SpotifyAPI(store.get("spotify.client_id"), store.get("spotify.client_secret"));

        window.onSpotifyWebPlaybackSDKReady = () => {
            this.player = new window.Spotify.Player({
                name: store.get("general.display_name") || "CarMedia",
                getOAuthToken: (cb) => cb(this.api.access_token),
                volume: 1
            });

            this.player.addListener("ready", (device) => (this.device = device));
            this.player.addListener("account_error", () => console.log("account error"));
            this.player.addListener("authentication_error", (error) => console.log("auth error", error));
            this.player.addListener("autoplay_failed", () => console.log("autoplay error"));
            this.player.addListener("initialization_error", () => console.log("init error"));
            this.player.addListener("not_ready", () => console.log("not ready"));
            this.player.addListener("playback_error", () => console.log("playback error"));

            this.player.addListener("player_state_changed", (state) => {
                if (!state) return;
                this.update({
                    paused: state.paused,
                    position: state.position,
                    track: {
                        artists: state.track_window.current_track?.artists.map((artist) => artist.name),
                        album: state.track_window.current_track?.album.name,
                        name: state.track_window.current_track?.name,
                        length: state.track_window.current_track?.duration_ms,
                        thumbnail: state.track_window.current_track?.album?.images[0]?.url,
                    },
                    timestamp: Date.now(),
                });
            });
        };

        if (!document.getElementById("spotify_script")) {
            const spotifyScript = document.createElement("script");
            spotifyScript.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
            spotifyScript.setAttribute("id", "spotify_script");
            document.body.appendChild(spotifyScript);
        }
    }

    async linkAccount(account: SpotifyAccount) {
        if (this.account) await this.disconnect();
        this.account = account;
    }

    async connect() {
        if (!this.player) return Promise.reject(new Error("no player available"));
        if (!this.account) return Promise.reject(new Error("no account selected"));
        await this.api.refresh(this.account.refresh_token);
        return this.player.connect();
    }

    async disconnect() {
        if (!this.player) return Promise.reject(new Error("no player available"));
        await this.player.pause();
        this.player.disconnect();
        return Promise.resolve();
    }

    async tranferPlayback() {
        const transfer = (device) => 
            this.api.instance.put("/me/player", { device_ids: [device.device_id], play: false })
            .then(() => this.activeDevice = true)
            .catch(() => this.activeDevice = false);
        if (this.device) await transfer(this.device);
        else this.player.addListener("ready", async (device) => transfer(device));
    }

    play() {
        return this.player.resume();
    }
    pause() {
        return this.player.pause();
    }
    nextTrack() {
        return this.player.nextTrack();
    }
    previousTrack() {
        return this.player.previousTrack();
    }
    seek(ms) {
        return this.player.seek(ms);
    }
}

export interface SpotifyAccount {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string;
        total: number;
    };
    href: string;
    images: [
        {
            url: string;
            height: number;
            width: number;
        }
    ];
    product: string;
    type: string;
    uri: string;
    refresh_token: string;
}
