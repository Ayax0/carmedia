import simpleGit from "simple-git";
import path from "path";
import url from 'url';
import fs from "fs";

export default defineEventHandler(async (event) => {
    console.log(path.dirname(url.fileURLToPath(import.meta.url)));
    const git = simpleGit(path.dirname(url.fileURLToPath(import.meta.url)));
    const gitRoot = await git.revparse(["--show-toplevel"]);
    console.log(gitRoot);
    const current_version = fs.readFileSync(path.join(gitRoot, "version.txt")).toString();
    
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
