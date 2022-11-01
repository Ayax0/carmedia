import alsa from "alsa-volume";

export var volume = 0;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!Number.isInteger(body.volume) || body.volume < 0 || body.volume > 100) {
        event.res.statusCode = 400;
        return "server error";
    }

    if(process.env.NODE_ENV !== 'production') {
        volume = body.volume;
    }else {
        const volumeRange = alsa.getVolumeRange("default", "Master");
        alsa.setVolume("default", "Master", volumeRange.min + ((volumeRange.max - volumeRange.min) / 100) * body.volume);
    }

    return { status: "ok" };
});
