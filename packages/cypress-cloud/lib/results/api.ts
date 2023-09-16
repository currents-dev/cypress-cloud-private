import Debug from "debug";
import {
  SetInstanceTestsPayload,
  TestState,
  UpdateInstanceResultsPayload,
} from "../api";

import { Standard } from "../cypress.types";
import { getRunScreenshots, getTestAttempt } from "./summarize";

const debug = Debug("currents:results");

export const getInstanceResultPayload = (
  runResult: Standard.ModuleAPI.Run,
  coverageFilePath?: string
): UpdateInstanceResultsPayload => {
  debug("generating instance result payload from %o", runResult);
  return {
    stats: runResult.stats,
    reporterStats: runResult.reporterStats,
    exception: runResult.error ?? null,
    video: !!runResult.video, // Did the instance generate a video?
    screenshots: getRunScreenshots(runResult.tests ?? []),
    hasCoverage: !!coverageFilePath,
    tests:
      (runResult.tests ?? []).map((test, i) => ({
        displayError: test.displayError,
        state: test.state as TestState,
        // @ts-ignore
        hooks: runResult.hooks ?? [],
        // @ts-ignore
        attempts: test.attempts?.map(getTestAttempt) ?? [],
        clientId: `r${i}`,
      })) ?? [],
  };
};

export const getInstanceTestsPayload = (
  runResult: Standard.ModuleAPI.Run,
  config: Cypress.ResolvedConfigOptions
): SetInstanceTestsPayload => {
  return {
    config: {
      ...config,
      // @ts-ignore
      videoUploadOnPasses: config?.videoUploadOnPasses ?? false,
    },
    tests:
      runResult.tests?.map((test, i) => ({
        title: test.title,
        config: null,
        body: test.body ?? "redacted",
        clientId: `r${i}`,
        hookIds: [],
      })) ?? [],
    hooks: runResult.hooks ?? [],
  };
};
