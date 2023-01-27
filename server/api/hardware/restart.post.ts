import childprocess from "child_process";

export default defineEventHandler(async (event) => {
    try {
        await exec("sudo reboot");
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
