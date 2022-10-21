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
    modules: ["./modules/socket.server"],
});
