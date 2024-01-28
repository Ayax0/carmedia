import Metadata from "@/framework/navigation/mbtiles/Metadata";
import Tiles from "@/framework/navigation/mbtiles/Tiles";
import db from "@/framework/navigation/mbtiles";

import vector_layers from "@/framework/navigation/mbtiles/vector_layers.json";

async function init() {
    await db.sync();

    console.log("initializing map cache");
    console.log("cached tiles:", await Tiles.count());
    await Metadata.upsert({ name: "name", value: "Carmedia Tileset" });
    await Metadata.upsert({ name: "format", value: "pbf" });
    await Metadata.upsert({ name: "bounds", value: "-180.0,-85,180,85" });
    await Metadata.upsert({ name: "center", value: "46.79874168671384,8.231611599291393,14" });
    await Metadata.upsert({ name: "minzoom", value: "0" });
    await Metadata.upsert({ name: "maxzoom", value: "15" });
    await Metadata.upsert({ name: "pixel_scale", value: "256" });
    await Metadata.upsert({ name: "attribution", value: "© ayax0" });
    await Metadata.upsert({ name: "description", value: "cached map tiles for carmedia" });
    await Metadata.upsert({ name: "json", value: JSON.stringify(vector_layers) });
    console.log("map cache initialized");
}
init();

export default defineEventHandler(() => "ok");
