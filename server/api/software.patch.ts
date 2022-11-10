import { exec } from "child_process";
import path from "path";

export default defineEventHandler(async (event) => {
    // if(process.env.NODE_ENV != "production") return;
    const root = process.env.NODE_ENV == "production" ? path.join(process.cwd(), "../", "../") : path.join(process.cwd());

    try {
        await new Promise((resolve, reject) => {
            exec("cd " + root + "&& npm i && npm i --save-dev && npm run build", (error, stdout) => {
                if(error) reject(error);
                else resolve(stdout);
            });
        });
        return "ok";
    } catch (error) {
        event.res.statusCode = 500;
        return "server error";
    }
});
