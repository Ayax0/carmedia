import layers from "@/public/layers.json";

export default defineEventHandler(() => {
    return {
        layers,
        sources: {
            map_local: {
                type: "vector",
                tiles: [(process.env.ORIGIN || "http://localhost:3000") + "/api/tiles/{z}/{x}/{y}"],
                maxzoom: 14,
                minzoom: 0,
                scheme: "xyz",
            },
        },
        glyphs: (process.env.ORIGIN || "http://localhost:3000") + "/fonts/{fontstack}/{range}.pbf",
        sprite: (process.env.ORIGIN || "http://localhost:3000") + "/sprite",
        version: 8,
    };
});
