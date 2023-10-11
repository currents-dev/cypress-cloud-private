import fs from "fs";
import path from "path";

import { CypressTypes } from "./cypress.types";
import { green } from "./log";
import { _cypressVersion } from "./state/global";

export function writeDataToFile(
  data: string,
  spec: string,
  type: string,
  suffix: string = ""
) {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (typeof process.env.JEST_WORKER_ID !== "undefined") {
    return;
  }
  const dir = path.resolve(`${_cypressVersion as string}/${spec}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
  const p = path.resolve(`${dir}/${type}${suffix}.json`);
  console.log(green(`\tWriting ${type} data to: ${p}`));
  fs.writeFileSync(p, data);
}
export function getSpecShortName(spec: string) {
  const dir = path.dirname(spec);
  return spec.replace(`${dir}/`, "");
}

const screenshots: Record<string, number> = {};
export function getScreenshotCount(spec: string) {
  if (!screenshots[spec]) {
    screenshots[spec] = 0;
  }
  screenshots[spec]++;
  return screenshots[spec];
}

const testsHooks: Record<string, string> = {};
export function getTestHookSpecName(
  test:
    | CypressTypes.EventPayload.TestAfter
    | CypressTypes.EventPayload.TestBefore
) {
  if (test.invocationDetails) {
    const r = getSpecShortName(test.invocationDetails.relativeFile);
    testsHooks[test.fullTitle] = r;
  }

  return testsHooks[test.fullTitle];
}
