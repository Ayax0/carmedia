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
        try {
            const volumeRange = alsa.getVolumeRange("default", "Master");
            alsa.setVolume("default", "Master", volumeRange.min + ((volumeRange.max - volumeRange.min) / 100) * body.volume);
        } catch(error) {
            console.error("ALSA error");
            console.error(error);
        }
    }

    return { status: "ok" };
});
