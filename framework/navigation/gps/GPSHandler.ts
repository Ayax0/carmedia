import { SerialPort, SerialPortOpenOptions } from "serialport";
import { Socket, SocketConnectOpts } from "net";
import { UBXParser } from "@nextlvlup/ubx-parser";
import MapRouter from "../osrm/MapRouter";

export default class GPSHandler {
    private stream: Socket | SerialPort;
    private parser: UBXParser = new UBXParser();
    private listeners: Map<GPSEvent, Array<(data: any) => void>> = new Map();
    private router: MapRouter = new MapRouter();

    constructor() {
        this.parser.on("data", async (data) => {
            if (data.lat && data.lon) {
                const snapped = await this.router.snapToGrid({ lat: data.lat, lon: data.lon });
                if (snapped && snapped.lat && snapped.lon && snapped.distance) {
                    // console.log("Acc:", data.hAcc / 1000, "Snap:", snapped.distance);
                    if (data.hAcc < 5000 && snapped.distance * 1000 < data.hAcc + 2000) {
                        data.lat = snapped.lat;
                        data.lon = snapped.lon;
                    }
                }
            }
            this.listeners.get("data")?.forEach((cb) => cb(data));
        });
    }

    listenSerial(options: SerialPortOpenOptions<any>) {
        this.stream = new SerialPort(options, (error) => {
            if (error) this.listeners.get("error")?.forEach((cb) => cb(error));
            else this.listeners.get("open")?.forEach((cb) => cb(null));
        });
        this.stream.on("close", (data) => this.listeners.get("close")?.forEach((cb) => cb(data)));
        this.stream.on("error", (data) => this.listeners.get("error")?.forEach((cb) => cb(data)));
        this.stream.on("data", (data) => {
            this.listeners.get("raw")?.forEach((cb) => cb(data));
            this.parser.parse(data);
        });
    }

    listenTCP(options: SocketConnectOpts) {
        this.stream = new Socket();
        this.stream.connect(options);
        this.stream.on("connect", (data) => this.listeners.get("open")?.forEach((cb) => cb(data)));
        this.stream.on("close", (data) => this.listeners.get("close")?.forEach((cb) => cb(data)));
        this.stream.on("error", (data) => this.listeners.get("error")?.forEach((cb) => cb(data)));
        this.stream.on("data", (data) => {
            this.listeners.get("raw")?.forEach((cb) => cb(data));
            this.parser.parse(data);
        });
    }

    on(event: GPSEvent, cb: (data: any) => void) {
        if (!this.listeners.has(event)) this.listeners.set(event, []);
        this.listeners.get(event).push(cb);
    }
}

type GPSEvent = "raw" | "data" | "error" | "open" | "close";
