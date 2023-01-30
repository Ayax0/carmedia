const fs = require("fs-extra");
const path = require("path");
const home = path.join(__dirname, "..");

if (!fs.pathExistsSync(path.join(home, "../.output/server/node_modules/@serialport/bindings-cpp/prebuilds"))) {
    console.log("serialport: no prebuilds found");
    fs.ensureDirSync(path.join(home, ".output/server/node_modules/@serialport/bindings-cpp/prebuilds"));
    fs.copySync(
        path.join(home, "node_modules/@serialport/bindings-cpp/prebuilds"),
        path.join(home, ".output/server/node_modules/@serialport/bindings-cpp/prebuilds")
    );
    console.log("serialport: prebuilds copied successfuly");
}
