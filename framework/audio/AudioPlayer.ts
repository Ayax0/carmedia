export default abstract class AudioPlayer {
    private listeners: Array<(state: AudioPlayerState) => void> = new Array();

    subscribe(cb: (state: AudioPlayerState) => void) {
        this.listeners.push(cb);
    }

    abstract play(): Promise<any>;
    abstract pause(): Promise<any>;
    abstract nextTrack(): Promise<any>;
    abstract previousTrack(): Promise<any>;
}

interface AudioPlayerState {
    isPlaying: boolean;
    track: AudioTrack;
}

interface AudioTrack {
    name: string;
    artists: Array<string>;
    thumbnail?: string;
    length?: number;
}
