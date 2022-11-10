import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
    try {
        const git = simpleGit(process.cwd());
        await git.pull();

        const current_version = fs.readFileSync(path.join(process.cwd(), "version.txt")).toString();
        const latest_version = await simpleGit(process.cwd()).revparse("HEAD");

        return {
            current_version,
            latest_version,
            latest: current_version == latest_version
        }
    }catch(error) {
        event.res.statusCode = 500;
        return "server error";
    }
});
