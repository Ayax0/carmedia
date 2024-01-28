import { Server } from "socket.io";
import gps from "@/framework/navigation/gps";

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

gps.on("data", (data) => io.emit("gps", data));

export default defineEventHandler(() => "ok");
