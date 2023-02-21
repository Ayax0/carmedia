import Metadata from "@/framework/navigation/mbtiles/Metadata";
import db from "@/framework/navigation/mbtiles";

import vector_layers from "@/framework/navigation/mbtiles/vector_layers.json";

async function init() {
    await db.sync();

    console.log("initializing map cache");
    await Metadata.upsert({ key: "name", value: "Carmedia Tileset" });
    await Metadata.upsert({ key: "format", value: "pbf" });
    await Metadata.upsert({ key: "bounds", value: "-180.0,-85,180,85" });
    await Metadata.upsert({ key: "center", value: "46.79874168671384,8.231611599291393,14" });
    await Metadata.upsert({ key: "minzoom", value: "0" });
    await Metadata.upsert({ key: "maxzoom", value: "15" });
    await Metadata.upsert({ key: "attribution", value: "© ayax0" });
    await Metadata.upsert({ key: "description", value: "cached map tiles for carmedia" });
    await Metadata.upsert({ key: "json", value: JSON.stringify(vector_layers) });
    console.log("map cache initialized");
}
init();

export default defineEventHandler(() => "ok");
