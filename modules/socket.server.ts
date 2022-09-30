import { Server } from "socket.io";

export default (_, nuxt) => {
    nuxt.hook("listen", (server) => {
        const io = new Server(server);
        nuxt.hook("close", () => io.close());

        io.on("connection", (socket) => {
            console.log("connection");
            socket.on("hallo", (msg) => io.emit("test", msg));
        });
    });
};
