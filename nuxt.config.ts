// https://v3.nuxtjs.org/api/configuration/nuxt.config
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

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
            viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        },
    },
    hooks: {
        "build:done": async () => {
            if (process.env.NODE_ENV == "production") {
                const version = await simpleGit(process.cwd()).revparse("HEAD");

                fs.writeFile(path.join(process.cwd(), "version.txt"), version, (err) => {
                    if (err) console.error(err);
                    else console.log("local version set");
                });
            }
        },
    },
});
