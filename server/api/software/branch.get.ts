import simpleGit from "simple-git";
import path from "path";
import url from 'url';
import fs from "fs";

export default defineEventHandler(async (event) => {
    const git = simpleGit(path.dirname(url.fileURLToPath(import.meta.url)));
    const gitRoot = await git.revparse(["--show-toplevel"]);
    
    var current_version;
    try {
        current_version = fs.readFileSync(path.join(gitRoot, "version.txt")).toString();
    } catch(error) {
        console.warn("version file not found");
    }

    var response = {
        ...(await git.branch(["-r"])),
        version: current_version?.substring(0, 7),
    };

    delete response.current;
    delete response.detached;
    response.all.forEach((branch) => {
        delete response.branches[branch].current;
        delete response.branches[branch].linkedWorkTree;
    })

    return response;
});
