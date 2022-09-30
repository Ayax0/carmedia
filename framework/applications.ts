const applications: Array<Application> = [
    {
        name: "Spotify",
        icon: "/assets/icons/spotify.png",
        path: "/app/spotify",
        onstart: () => console.log("test"),
    },
    {
        name: "Soundcloud",
        icon: "/assets/icons/soundcloud.png",
        onstart: () => console.log("test"),
    },
    {
        name: "Navigation",
        icon: "/assets/icons/maps.webp",
        path: "/app/maps",
        onstart: () => console.log("test"),
    },
];

export default applications;

interface Application {
    name: string;
    icon: string;
    path?: string;
    keepalive?: boolean;
    category?: string;
    onstart?: () => void;
    onstop?: () => void;
}
