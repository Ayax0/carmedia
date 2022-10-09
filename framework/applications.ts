import SpotifyPlayer from "./audio/SpotifyPlayer";
import CarMedia from "./CarMedia";

export interface Application {
    id: string;
    name: string;
    icon: string;
    thumbnail: string;
    path?: string;
    persistent?: boolean;
    background?: boolean;
    category?: string;
    settings?: string;
    onstart?: (instance: CarMedia) => void;
    onstop?: (instance: CarMedia) => void;
}

const applications: Array<Application> = [
    {
        id: "spotify",
        name: "Spotify",
        icon: "mdi-spotify",
        thumbnail: "/assets/icons/spotify.png",
        path: "/spotify",
        settings: "/settings/spotify",
        persistent: true,
        background: true,
        onstart: (instance) => {
            if (!(instance.activeAudioPlayer instanceof SpotifyPlayer)) {
                instance.setAudioPlayer(new SpotifyPlayer());
            }
        },
    },
    {
        id: "soundcloud",
        name: "Soundcloud",
        icon: "mdi-soundcloud",
        thumbnail: "/assets/icons/soundcloud.png",
    },
    {
        id: "navigation",
        name: "Navigation",
        icon: "mdi-navigation-variant",
        thumbnail: "/assets/icons/maps.webp",
        path: "/app/maps",
        settings: "/settings/navigation",
    },
    {
        id: "settings",
        name: "Einstellungen",
        icon: "mdi-cogs",
        thumbnail: "/assets/icons/settings.png",
        path: "/settings",
    },
];

export default applications;
