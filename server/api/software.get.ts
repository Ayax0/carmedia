import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
    try {
        const git = simpleGit("carmedia");
        await git.pull();

        const current_version = fs.readFileSync(path.join("carmedia", "version.txt")).toString();
        const latest_version = await git.revparse("HEAD");

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
