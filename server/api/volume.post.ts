import alsa from "alsa-volume";

export default defineEventHandler(async (event) => {
    if(process.env.NODE_ENV !== 'production') return { status: "ok" };

    const volumeRange = alsa.getVolumeRange("default", "Master");
    const body = await readBody(event);
    if (!Number.isInteger(body.volume) || body.volume < 0 || body.volume > 100) {
        event.res.statusCode = 400;
        return "server error";
    }
    alsa.setVolume("default", "Master", volumeRange.min + ((volumeRange.max - volumeRange.min) / 100) * body.volume);
    return { status: "ok" };
});
