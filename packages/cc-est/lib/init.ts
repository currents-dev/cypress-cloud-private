import { require } from "./require";
import "./stdout";
import "./ws";

const cypressPkg = require("cypress/package.json");
const pkg = require("@currents/cc-est/package.json");

import { initCapture } from "./capture";
import { setCurrentsVersion, setCypressVersion } from "./state/global";

initCapture();
setCypressVersion(cypressPkg.version);
setCurrentsVersion(pkg.version);
