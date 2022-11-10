import { exec } from "child_process";
import path from "path";

export default defineEventHandler(async (event) => {
    try {
        await new Promise((resolve, reject) => {
            exec("cd " + process.cwd() + "&& npm i && npm i --save-dev && npm run build", (error, stdout) => {
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
