import AudioPlayer from "./audio/AudioPlayer";
import { Application } from "./applications";

export default class CarMedia {
    private audio_player: AudioPlayer;
    private active_apps: Array<Application> = new Array();

    async setAudioPlayer(player: AudioPlayer) {
        if (this.audio_player) await this.audio_player.pause();
        this.audio_player = player;
    }

    openApplication(app: Application) {
        this.active_apps.forEach((app) => {
            if (!app.keepalive) {
                if (app.onstop) app.onstop();
            }
        });
        this.active_apps = this.active_apps.filter((app) => app.keepalive);
        this.active_apps.push(app);
        if (app.onstart) app.onstart();
        if (app.path) navigateTo(app.path);
    }
}
