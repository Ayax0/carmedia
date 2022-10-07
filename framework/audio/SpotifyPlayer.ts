import AudioPlayer from "./AudioPlayer";
import "@types/spotify-web-playback-sdk";

export default class SpotifyPlayer extends AudioPlayer {
    player: Spotify.Player;

    constructor() {
        window.onSpotifyWebPlaybackSDKReady = () => {
            // TODO
            this.player = new window.Spotify.Player({
                name: undefined, //TODO
                getOAuthToken: (cb) => cb("TODO"),
            });
        };
        const spotifyScript = document.createElement("script");
        spotifyScript.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
        document.body.appendChild(spotifyScript);

        super();
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
}
