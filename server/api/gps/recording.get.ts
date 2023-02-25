import { Recorder } from "@/framework/navigation/gps";

export default defineEventHandler((): RecordingState => ({ status: Recorder.isRecording(), recordings: Recorder.list() }));

interface RecordingState {
    status: boolean;
    recordings: Array<string>;
}
