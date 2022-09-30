// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { resolve } from "path";

export default defineNuxtConfig({
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/style/variables.scss";',
                },
            },
        },
    },
    modules: ["./modules/socket.server"],
});
