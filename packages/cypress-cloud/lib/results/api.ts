import Debug from "debug";
import { InstanceAPIPayload } from "../api";

import { Standard } from "../cypress.types";
import { getRandomString } from "../nano";
import { ConfigState } from "../state";

const debug = Debug("currents:results");

export const getInstanceResultPayload = (
  runResult: Standard.ModuleAPI.Run,
  coverageFilePath?: string
): InstanceAPIPayload.UpdateInstanceResultsPayload => {
  debug("generating instance result payload from %o", runResult);
  return {
    stats: StandardResultsToAPIResults.getStats(runResult.stats),
    reporterStats: runResult.reporterStats,
    exception: runResult.error ?? null,
    video: !!runResult.video, // Did the instance generate a video?
    screenshots: StandardResultsToAPIResults.getAllScreenshots(runResult),
    hasCoverage: !!coverageFilePath,
    tests: (runResult.tests ?? []).map(
      StandardResultsToAPIResults.getTestForResults
    ),
  };
};

export const getInstanceTestsPayload = (
  runResult: Standard.ModuleAPI.Run,
  config: ConfigState
): InstanceAPIPayload.SetInstanceTestsPayload => {
  return {
    // @ts-ignore
    config: {
      ...config.getConfig(),
      // @ts-ignore
      videoUploadOnPasses: config.getConfig()?.videoUploadOnPasses ?? true,
    },
    tests: (runResult.tests ?? []).map(
      StandardResultsToAPIResults.getTestForSetTests
    ),
    hooks: runResult.hooks,
  };
};

/**
 * Map standard results to API result
 */
class StandardResultsToAPIResults {
  static getTestAttempt(
    attempt: Standard.ModuleAPI.TestAttempt
  ): InstanceAPIPayload.TestAttempt {
    return {
      state: attempt.state,
      error: attempt.error,
      wallClockStartedAt: attempt.startedAt,
      wallClockDuration: attempt.duration,
      videoTimestamp: attempt.videoTimestamp,
    };
  }
  static getTestForResults(
    test: Standard.ModuleAPI.Test,
    index: number
  ): InstanceAPIPayload.SetResultsTestsPayload {
    return {
      displayError: test.displayError,
      state: test.state,
      attempts: (test.attempts ?? []).map(
        StandardResultsToAPIResults.getTestAttempt
      ),
      clientId: `r${index}`,
    };
  }

  static getTestForSetTests(
    test: Standard.ModuleAPI.Test,
    index: number
  ): InstanceAPIPayload.SetTestsPayload {
    return {
      body: "redacted",
      title: test.title,
      clientId: `r${index}`,
    };
  }
  static getAllScreenshots(
    run: Standard.ModuleAPI.Run
  ): InstanceAPIPayload.UpdateInstanceResultsPayload["screenshots"] {
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
  ): InstanceAPIPayload.UpdateInstanceResultsPayload["stats"] {
    return {
      ...stats,
      wallClockDuration: stats.duration,
      wallClockStartedAt: stats.startedAt,
      wallClockEndedAt: stats.endedAt,
    };
  }
}
