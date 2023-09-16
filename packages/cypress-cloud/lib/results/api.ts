import Debug from "debug";
import {
  SetInstanceTestsPayload,
  TestState,
  UpdateInstanceResultsPayload,
} from "../api";

import { Standard } from "../cypress.types";
import { getRandomString } from "../nano";
import { ConfigState } from "../state";
import { getTestAttempt } from "./summarize";

const debug = Debug("currents:results");

export const getInstanceResultPayload = (
  runResult: Standard.ModuleAPI.Run,
  coverageFilePath?: string
): UpdateInstanceResultsPayload => {
  debug("generating instance result payload from %o", runResult);
  return {
    stats: StandardResultsToAPIResults.getStats(runResult.stats),
    reporterStats: runResult.reporterStats,
    exception: runResult.error ?? null,
    video: !!runResult.video, // Did the instance generate a video?
    screenshots: StandardResultsToAPIResults.getAllScreenshots(runResult),
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
  config: ConfigState
): SetInstanceTestsPayload => {
  return {
    // @ts-ignore
    config: {
      ...config.getConfig(),
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

class StandardResultsToAPIResults {
  static getAllScreenshots(
    run: Standard.ModuleAPI.Run
  ): UpdateInstanceResultsPayload["screenshots"] {
    return (run.tests ?? []).flatMap((t, i) =>
      t.attempts.flatMap((a, j) =>
        a.screenshots.map((s) => ({
          ...s,
          testId: `r${i}`,
          testAttemptIndex: j,
          screenshotId: getRandomString(),
        }))
      )
    );
  }

  static getStats(
    stats: Standard.ModuleAPI.Run["stats"]
  ): UpdateInstanceResultsPayload["stats"] {
    return {
      ...stats,
      wallClockDuration: stats.duration,
      wallClockStartedAt: stats.startedAt,
      wallClockEndedAt: stats.endedAt,
    };
  }
}
