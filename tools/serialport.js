const fs = require("fs-extra");

if (!fs.pathExistsSync("../.output/server/node_modules/@serialport/bindings-cpp/prebuilds")) {
    console.log("serialport: no prebuilds found");
    fs.ensureDirSync("../.output/server/node_modules/@serialport/bindings-cpp/prebuilds");
    fs.copySync("../node_modules/@serialport/bindings-cpp/prebuilds", "../.output/server/node_modules/@serialport/bindings-cpp/prebuilds");
    console.log("serialport: prebuilds copied successfuly");
}
