import AudioPlayer from "./audio/AudioPlayer";
import { Application } from "./applications";

export default class CarMedia {
    private audio_player: AudioPlayer;
    private active_apps: Array<Application> = new Array();

    async setAudioPlayer(player: AudioPlayer) {
        if (this.audio_player) await this.audio_player.disconnect();
        this.audio_player = player;
    }

    get activeAudioPlayer(): AudioPlayer {
        return this.audio_player;
    }

    openApplication(app: Application) {
        this.active_apps.forEach((app) => {
            if (!app.persistent) {
                if (app.onstop) app.onstop(this);
            }
        });
        this.active_apps = this.active_apps.filter((app) => app.persistent);
        this.active_apps.unshift(app);
        if (app.onstart) app.onstart(this);
        if (app.path) navigateTo(app.path);
    }

    openActiveApplication() {
        if (this.activeApplication?.path) navigateTo(this.activeApplication.path);
        else navigateTo("/");
    }

    get activeApplication(): Application {
        return this.active_apps.filter((application) => !application.background)[0];
    }
}
