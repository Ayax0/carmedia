export default abstract class AudioPlayer {
    protected listeners: Array<(state: AudioPlayerState) => void> = new Array();
    public player_state: AudioPlayerState;

    subscribe(cb: (state: AudioPlayerState) => void) {
        this.listeners.push(cb);
    }

    update(state: AudioPlayerState) {
        this.listeners.forEach((listener) => listener(state));
        this.player_state = state;
    }

    abstract connect(): Promise<any>;
    abstract disconnect(): Promise<any>;

    abstract play(): Promise<any>;
    abstract pause(): Promise<any>;
    abstract nextTrack(): Promise<any>;
    abstract previousTrack(): Promise<any>;
}

interface AudioPlayerState {
    paused: boolean;
    position: number;
    track: AudioTrack;
    timestamp: number;
}

interface AudioTrack {
    name: string;
    album: string;
    artists: Array<string>;
    thumbnail?: string;
    length?: number;
}
