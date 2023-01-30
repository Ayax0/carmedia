import fs from "fs";

if (!fs.existsSync("../.output/server/node_modules/@serialport/bindings-cpp/prebuilds")) {
    console.log("serialport: no prebuilds found");
    fs.cpSync("../node_modules/@serialport/bindings-cpp/prebuilds", "../.output/server/node_modules/@serialport/bindings-cpp/prebuilds");
    console.log("serialport: prebuilds copied successfuly");
}
