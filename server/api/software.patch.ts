import simpleGit from "simple-git";
import childprocess from "child_process";
import path from "path";
import url from 'url';

export default defineEventHandler(async (event) => {
    try {
        const gitRoot = await simpleGit(path.dirname(url.fileURLToPath(import.meta.url))).revparse(["--show-toplevel"]);

        await exec("cd " + gitRoot);
        await exec("sudo npm i");
        await exec("sudo npm i --save-dev");
        await exec("sudo npm run build");

        if(process.env.NODE_ENV == "production") await exec("sudo reboot");
        return "ok";
    } catch (error) {
        console.log(error);
        event.res.statusCode = 500;
        return "server error";
    }
});

function exec(cmd) {
    return new Promise((resolve, reject) => {
        childprocess.exec(cmd, (error, stdout) => {
            if(error) reject(error);
            else resolve(stdout);
        });
    });
}
