// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/style/variables.scss";',
                },
            },
        },
        build: {
            sourcemap: false,
        },
    },
    modules: ["nuxt-icon"],
    serverHandlers: [
        {
            route: "/ws",
            handler: "@/server-middleware/socket",
        },
    ],
    app: {
        head: {
            viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        }
    }
});
