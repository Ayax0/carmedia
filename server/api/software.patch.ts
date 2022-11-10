import { exec } from "child_process";

export default defineEventHandler(async (event) => {
    try {
        await new Promise((resolve, reject) => {
            exec("cd ~/carmedia && sudo npm i && sudo npm i --save-dev && sudo npm run build && sudo reboot", (error, stdout) => {
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
