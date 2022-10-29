import alsa from "alsa-volume";

export default defineEventHandler((event) => {
    if(process.env.NODE_ENV !== 'production') return { volume: 20 };

    const volumeRange = alsa.getVolumeRange("default", "Master");
    return { volume: Math.round(alsa.getVolume("default", "Master") / ((volumeRange.max - volumeRange.min) / 100)) };
});
