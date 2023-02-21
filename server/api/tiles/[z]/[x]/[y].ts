import { PassThrough } from "stream";
import Tiles from "@/framework/navigation/mbtiles/Tiles";

export default defineEventHandler(async (event) => {
    const x = parseInt(event.context.params?.x as string);
    const y = parseInt(event.context.params?.y as string);
    const z = parseInt(event.context.params?.z as string);

    if (isNaN(x) || isNaN(y) || isNaN(z)) throw createError({ statusCode: 400, statusMessage: "invalide tile" });

    const tile = await Tiles.findOne({ where: { zoom_level: z, tile_column: x, tile_row: y } });
    if (tile) {
        console.log("load tile from cache");

        const view = new Uint8Array(tile.tile_data);
        const readStream = new PassThrough();
        readStream.end(view);

        sendStream(event, readStream);
    } else {
        const result = await fetch(`https://api.maptiler.com/tiles/v3/${z}/${x}/${y}.pbf?key=iHYc2jkalmprZBsL4zHn`);
        const buffer = Buffer.from(await result.arrayBuffer());
        const view = new Uint8Array(buffer);
        const readStream = new PassThrough();
        readStream.end(view);

        sendStream(event, readStream);

        const cache_tile = await Tiles.create({ zoom_level: z, tile_column: x, tile_row: y, tile_data: buffer });
        cache_tile
            .save()
            .then(() => console.log("cached => x:", x, "y:", y, "z:", z))
            .catch(() => console.error("failed to cache => x:", x, "y:", y, "z:", z));
    }
});
