import alsa from "alsa-volume";
import { volume } from "./volume.post";

export default defineEventHandler((event) => {
    if(process.env.NODE_ENV !== 'production') {
        return { volume };
    } else {
        try {
            const volumeRange = alsa.getVolumeRange("default", "Master");
            return { volume: Math.round(alsa.getVolume("default", "Master") / ((volumeRange.max - volumeRange.min) / 100)) };
        } catch(error) {
            console.error("ALSA error");
            console.error(error);
        }
    }
});
