export interface Application {
    id: string;
    name: string;
    icon: string;
    thumbnail: string;
    path?: string;
    keepalive?: boolean;
    category?: string;
    settings?: string;
    onstart?: () => void;
    onstop?: () => void;
}

const applications: Array<Application> = [
    {
        id: "spotify",
        name: "Spotify",
        icon: "mdi:spotify",
        thumbnail: "/assets/icons/spotify.png",
        path: "/app/spotify",
        settings: "/settings/spotify",
    },
    {
        id: "soundcloud",
        name: "Soundcloud",
        icon: "mdi:soundcloud",
        thumbnail: "/assets/icons/soundcloud.png",
    },
    {
        id: "navigation",
        name: "Navigation",
        icon: "mdi:navigation-variant",
        thumbnail: "/assets/icons/maps.webp",
        path: "/app/maps",
        settings: "/settings/navigation",
    },
    {
        id: "settings",
        name: "Einstellungen",
        icon: "mdi:cogs",
        thumbnail: "/assets/icons/settings.png",
        path: "/settings",
    },
];

export default applications;
