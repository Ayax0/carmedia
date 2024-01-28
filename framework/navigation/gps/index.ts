import GPSHandler from "./GPSHandler";
import RecordingHandler from "./RecordingHandler";

const handler = new GPSHandler();
const Recorder = new RecordingHandler("./gps_dump");

if (process.env.NODE_ENV !== "production") handler.listenTCP({ host: process.env.GPS_HOST, port: Number.parseInt(process.env.GPS_PORT) });
else handler.listenSerial({ path: "/dev/ttyS0", baudRate: 460800 });

handler.on("error", (error) => console.log("gps error:", error));
handler.on("open", () => {
    console.log("gps connected");
    handler.on("raw", (data) => Recorder.write(data));
});

export default handler;
export { Recorder };
