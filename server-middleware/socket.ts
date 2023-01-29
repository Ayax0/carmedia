import { Server } from "socket.io";
import { Socket } from "net";
import { SerialPort } from "serialport";
import UBXParser from "@nextlvlup/ubx-parser";
import UBX_NAV_PVT_Parser from "@nextlvlup/ubx-parser/lib/parser/ubx-nav-pvt";

const io = new Server(3001, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("Connection", socket.id);
});

io.on("connect", (socket) => {
    socket.emit("message", `welcome ${socket.id}`);
    socket.broadcast.emit("message", `${socket.id} joined`);

    socket.on("message", function message(data: any) {
        console.log("message received: %s", data);
        socket.emit("message", { data });
    });

    socket.on("disconnecting", () => {
        console.log("disconnected", socket.id);
        socket.broadcast.emit("message", `${socket.id} left`);
    });
});

const gnss_parser = new UBXParser["default"]();
gnss_parser.registerParser(new UBX_NAV_PVT_Parser["default"]());

if (process.env.NODE_ENV !== "production") {
    const client = new Socket();
    client.connect({ host: process.env.GPS_HOST, port: Number.parseInt(process.env.GPS_PORT) });
    client.on("data", (buffer) => gnss_parser.parse(buffer));
} else {
    try {
        const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 460800 });
        port.on("data", (data) => gnss_parser.parse(data));
    } catch (error) {
        console.log(error);
    }
}

gnss_parser.on("data", (data) => io.emit("gps", data));

export default function (req, res, next) {
    res.statusCode = 200;
    res.end();
}
