import alsa from "alsa-volume";
import { volume } from "./volume.post";

export default defineEventHandler((event) => {
    if(process.env.NODE_ENV !== 'production') {
        return { volume };
    } else {
        const volumeRange = alsa.getVolumeRange("default", "Master");
        return { volume: Math.round(alsa.getVolume("default", "Master") / ((volumeRange.max - volumeRange.min) / 100)) };
    }
});
