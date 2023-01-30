const fs = require("fs");

if (!fs.existsSync("../.output/server/node_modules/@serialport/bindings-cpp/prebuilds")) {
    console.log("serialport: no prebuilds found");
    fs.copyFileSync("../node_modules/@serialport/bindings-cpp/prebuilds", "../.output/server/node_modules/@serialport/bindings-cpp/prebuilds");
    console.log("serialport: prebuilds copied successfuly");
}
