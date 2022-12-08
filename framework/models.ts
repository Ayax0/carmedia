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
            head_light: "headlights inside.002",
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
            head_light: "headlights.004",
            back_light: "backlights.002",
        },
        offset: {
            y: 70,
            scale_x: 1.5,
            scale_y: 1.5,
            scale_z: 1.5,
        },
    },
    {
        name: "Dodge RAM",
        path: "/3d/dodgeram.fbx",
        color: {
            primary: 0x020A38,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "car body",
            head_light: "headlights",
            back_light: "backlights",
        },
		offset: {
			y: 40,
			scale_x: 0.8,
            scale_y: 0.8,
            scale_z: 0.8,
			rotation_y: 180,
        },
    },
    {
        name: "Mercedes AMG C63",
        path: "/3d/mercedesc63.fbx",
        color: {
            primary: 0xFFFFFF,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "body.001",
            head_light: "headlights led.001",
            back_light: "backlights led",
        },
		offset: {
            y: -70,
			scale_x: 1.5,
            scale_y: 1.5,
            scale_z: 1.5,
        },
    },
    {
        name: "Nissan GTR",
        path: "/3d/nissangtr.fbx",
        color: {
            primary: 0xE7642B,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "body.002",
            head_light: "headlights led.001",
            back_light: "backlights inside.002",
        },
		offset: {
            y: -60,
        },
    },
    {
        name: "Skoda Octavia",
        path: "/3d/skodaoctavia.fbx",
        color: {
            primary: 0x217FB6,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "body.003",
            head_light: "headlights led.002",
            back_light: "backlights dark.001",
        },
		offset: {
            y: -70,
			scale_x: 1.4,
            scale_y: 1.4,
            scale_z: 1.4,
        },
    },
    {
        name: "Volkswagen Beetle",
        path: "/3d/volkswagenbeetle.fbx",
        color: {
            primary: 0xFFE85A,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "body.016",
            head_light: "headlights.016",
            back_light: "backlight.003",
        },
		offset: {
            y: -70,
			rotation_y: 180,
        },
    },
    {
        name: "Smart Fortwo",
        path: "/3d/smartfortwo.fbx",
        color: {
            primary: 0xE71F1C,
            secondary: 0xE71F1C,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "body.014",
            secondary: "body black.004",
            head_light: "headlights.014",
            back_light: "backlights dark.009",
        },
		offset: {
            y: -70,
        },
		
    },
    {
        name: "Tesla Cybertruck",
        path: "/3d/cybertruck.fbx",
        color: {
            primary: 0xB4BEC0,
            head_light: 0xfffffb,
            back_light: 0xff0000,
        },
        colorMapping: {
            primary: "BaseColor.002",
            head_light: "Headlight.002",
            back_light: "Taillight.002",
        },
		offset: {
			y: 30,
			scale_x: 0.5,
            scale_y: 0.5,
            scale_z: 0.5,
        },
    },
    {
        name: "UFO",
        path: "/3d/ufo.fbx",
        color: {
            primary: 0x747474,
            head_light: 0x7CE700,
            back_light: 0x009DB1,
        },
        colorMapping: {
            primary: "Metal.003",
            head_light: "Light.003",
            back_light: "Material.005",
        },
        offset: {
            y: 50,
			scale_x: 0.5,
            scale_y: 0.5,
            scale_z: 0.5,
        },
    },
];

export default models;
