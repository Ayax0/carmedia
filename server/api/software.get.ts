import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
    try {
        const git = simpleGit(process.cwd());
        await git.pull();

        const root = process.env.NODE_ENV == "production" ? path.join(process.cwd(), "../", "../") : path.join(process.cwd());

        const current_version = fs.readFileSync(path.join(root, "version.txt")).toString();
        const latest_version = await simpleGit(process.cwd()).revparse("HEAD");

        return {
            current_version,
            latest_version,
            latest: current_version == latest_version
        }
    }catch(error) {
        console.log(error);
        event.res.statusCode = 500;
        return "server error";
    }
});
