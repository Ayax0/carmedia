import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import url from 'url';

export default defineEventHandler(async (event) => {
    try {
        const gitRoot = await simpleGit(path.dirname(url.fileURLToPath(import.meta.url))).revparse(["--show-toplevel"]);

        const git = simpleGit(gitRoot);
        await git.pull();

        const current_version = fs.readFileSync(path.join(gitRoot, "version.txt")).toString();
        const latest_version = await git.revparse("HEAD");

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
