import { ScreenshotArtifact } from "cypress-cloud/types";
import Debug from "debug";
import _ from "lodash";
import { nanoid } from "nanoid";
import { TestState } from "../api";
import { MergedConfig } from "../config";
import { Standard } from "../cypress.types";
import { TestAttempt } from "../runner/spec.type";
import { emptyStats } from "./empty";
import { ModuleAPIResults } from "./moduleAPIResult";

const debug = Debug("currents:results");

export const getRunScreenshots = (
  tests: CypressCommandLine.TestResult[] = []
): ScreenshotArtifact[] => {
  return tests.flatMap((test, i) =>
    test.attempts.flatMap((a, ai) =>
      (a.screenshots ?? []).flatMap((s) => ({
        ...s,
        testId: `r${i}`,
        testAttemptIndex: ai,
        screenshotId: nanoid(),
      }))
    )
  );
};

export const getTestAttempt = (attempt: TestAttempt) => {
  return {
    ...attempt,
    state: attempt.state as TestState,
    // @ts-ignore
    wallClockDuration: attempt.wallClockDuration ?? attempt.duration ?? 0,
    // @ts-ignore
    wallClockStartedAt: attempt.wallClockStartedAt ?? attempt.startedAt,
  };
};

export const summarizeExecution = (
  input: Standard.ModuleAPI.CompletedResult[],
  config: MergedConfig
): Standard.ModuleAPI.CompletedResult => {
  if (!input.length) {
    return ModuleAPIResults.getEmptyResult(config);
  }

  const overall = input.reduce(
    (
      acc,
      {
        totalDuration,
        totalFailed,
        totalPassed,
        totalPending,
        totalSkipped,
        totalTests,
        totalSuites,
      }
    ) => ({
      totalDuration: acc.totalDuration + totalDuration,
      totalSuites: acc.totalSuites + totalSuites,
      totalPending: acc.totalPending + totalPending,
      totalFailed: acc.totalFailed + totalFailed,
      totalSkipped: acc.totalSkipped + totalSkipped,
      totalPassed: acc.totalPassed + totalPassed,
      totalTests: acc.totalTests + totalTests,
    }),
    emptyStats
  );
  const firstResult = input[0];
  const startItems = input.map((i) => i.startedTestsAt).sort();
  const endItems = input.map((i) => i.endedTestsAt).sort();
  const runs = input.map((i) => i.runs).flat();
  return {
    ...overall,
    runs,
    startedTestsAt: _.first(startItems) as string,
    endedTestsAt: _.last(endItems) as string,
    ..._.pick(
      firstResult,
      "browserName",
      "browserVersion",
      "browserPath",
      "osName",
      "osVersion",
      "cypressVersion",
      "config"
    ),
    status: "finished",
  };
};
