export interface Model {
    name: string;
    path: string;
    offset?: {
        x?: number;
        y?: number;
        z?: number;
        rotation_x?: number;
        rotation_y?: number;
        rotation_z?: number;
        scale_x?: number;
        scale_y?: number;
        scale_z?: number;
    };
    color: {
        primary?: number;
        secondary?: number;
        head_light?: number;
        back_light?: number;
    };
    colorMapping: {
        primary?: string;
        secondary?: string;
        head_light?: string;
        back_light?: string;
    };
}

const models: Array<Model> = [
    {
        name: "Opel Corsa C1.4",
        path: "/3d/opelcorsac.fbx",
        color: {
            primary: 0xcccccc,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "MainColor",
            head_light: "Lights",
            back_light: "BackLight",
        },
    },
    {
        name: "Toyota Aygo",
        path: "/3d/toyotaaygo.fbx",
        color: {
            primary: 0x1c1c1c,
            secondary: 0x1c1c1c,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "bofy.002",
            secondary: "body black.006",
            head_light: "headlights inside.003",
            back_light: "backlights silver.002",
        },
        offset: {
            y: -75,
        },
    },
    {
        name: "Jeep Wrangler",
        path: "/3d/jeepwrangler.fbx",
        color: {
            primary: 0xbd0000,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "body red.002",
            head_light: "headlights 2.002",
            back_light: "backlights dark.003",
        },
        offset: {
            y: 50,
        },
    },
    {
        name: "Volkswagen T2",
        path: "/3d/volkswagent2.fbx",
        color: {
            primary: 0x52b1e7,
            secondary: 0xddd4d1,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "lower body.001",
            secondary: "upper body.001",
            head_light: "headlights.003",
            back_light: "backlights.001",
        },
        offset: {
            y: 70,
            scale_x: 1.5,
            scale_y: 1.5,
            scale_z: 1.5,
        },
    },
];

export default models;
