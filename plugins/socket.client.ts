import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            socket: io(window.location.protocol + "//" + window.location.hostname + ":3001"),
        },
    };
});
