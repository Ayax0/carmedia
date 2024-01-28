import { Recorder } from "@/framework/navigation/gps";

export default defineEventHandler((event) => {
    if (Recorder.isRecording()) {
        const state = Recorder.stop();
        if (state) return "ok";
    } else {
        const state = Recorder.record();
        if (state) return "ok";
    }
    throw createError({ statusCode: 500, statusMessage: "server error" });
});
