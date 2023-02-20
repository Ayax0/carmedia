import { PassThrough } from "stream";
import { isConnected } from "@/db";
import MapTile from "@/db/MapTile";

export default defineEventHandler(async (event) => {
    const x = parseInt(event.context.params?.x as string);
    const y = parseInt(event.context.params?.y as string);
    const z = parseInt(event.context.params?.z as string);
    var tile;

    const dbState = await isConnected();

    if (isNaN(x) || isNaN(y) || isNaN(z)) throw createError({ statusCode: 400, statusMessage: "invalide tile" });
    if (dbState) tile = await MapTile.findOne({ where: { x, y, z } });

    if (tile) {
        console.log("load tile from cache");

        const view = new Uint8Array(tile.tile);
        const readStream = new PassThrough();
        readStream.end(view);

        return sendStream(event, readStream);
    } else {
        const result = await fetch(`https://api.maptiler.com/tiles/v3/${z}/${x}/${y}.pbf?key=iHYc2jkalmprZBsL4zHn`);
        const buffer = Buffer.from(await result.arrayBuffer());
        const view = new Uint8Array(buffer);
        const readStream = new PassThrough();
        readStream.end(view);

        if (dbState) {
            const cache_tile = await MapTile.create({ x, y, z, tile: buffer, timestamp: new Date() });
            cache_tile
                .save()
                .then(() => console.log("cached => x:", x, "y:", y, "z:", z))
                .catch(() => console.error("failed to cache => x:", x, "y:", y, "z:", z));
        } else console.error("no caching available");

        return sendStream(event, readStream);
    }
});
