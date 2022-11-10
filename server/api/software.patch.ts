import { exec } from "child_process";

export default defineEventHandler(async (event) => {
    // if(process.env.NODE_ENV != "production") return;
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
