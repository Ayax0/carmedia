import AudioPlayer from "./audio/AudioPlayer";

export default class CarMedia {
    private audio_player: AudioPlayer;

    async setAudioPlayer(player: AudioPlayer) {
        if (this.audio_player) await this.audio_player.pause();
        this.audio_player = player;
    }
}
