#!/usr/bin/env node
import "source-map-support/register";

import { ValidationError } from "../lib/errors";
import { withError } from "../lib/log";
import { run } from "../lib/run";
import { parseCLIOptions, program } from "./lib";

async function main() {
  return run(parseCLIOptions());
}

main()
  .then((result) => {
    if (!result) {
      process.exit(1);
    }

    // @ts-ignore: running bare cypress in offline mode breaks the types
    if (result.status === "failed") {
      process.exit(1);
    }
    // @ts-ignore: running bare cypress in offline mode breaks the types
    const overallFailed = result.totalFailed + result.totalSkipped;
    if (overallFailed > 0) {
      process.exit(overallFailed);
    }
    process.exit(0);
  })
  .catch((err) => {
    if (err instanceof ValidationError) {
      program.error(withError(err.toString()));
    } else {
      console.error(err);
    }
    process.exit(1);
  });
