import { Server } from "socket.io";

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

export default function (req, res, next) {
    res.statusCode = 200;
    res.end();
}
