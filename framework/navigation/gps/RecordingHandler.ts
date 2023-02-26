import fs from "fs";
import path from "path";

export default class RecordingHandler {
    private filestream: fs.WriteStream;
    private base_path: string;

    constructor(base_path: string) {
        if (!fs.existsSync(base_path)) fs.mkdirSync(base_path);
        this.base_path = base_path;
    }

    write(data: any) {
        if (this.filestream) this.filestream.write(data);
    }

    record(): boolean {
        if (this.filestream) return false;
        this.filestream = fs.createWriteStream(path.join(this.base_path, `out_${Date.now()}.ubx`));
        this.filestream.on("error", (error) => console.log(error));
        console.log("start recording...");
        return true;
    }

    stop(): boolean {
        if (!this.filestream) return false;
        this.filestream.on("finish", () => console.log("recording saved"));
        this.filestream.end();
        this.filestream = undefined;
        return true;
    }

    isRecording() {
        return this.filestream != undefined;
    }

    list() {
        return fs.readdirSync(this.base_path);
    }
}
