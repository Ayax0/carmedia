import alsa from "alsa-volume";

const volumeRange = alsa.getVolumeRange("default", "Master");

export default defineEventHandler((event) => {
    return { volume: Math.round(alsa.getVolume("default", "Master") / ((volumeRange.max - volumeRange.min) / 100)) };
});
