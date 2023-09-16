import { parseISO } from "date-fns";
import { MergedConfig } from "../config";
import { CypressTypes, Standard } from "../cypress.types";
import {
  ExecutionState,
  ExecutionStateScreenshot,
  ExecutionStateTestAttempt,
} from "../state";

import { SpecAfterResult } from "./specAfterResult";

export class ModuleAPIResults {
  static getRunScreenshots(run: CypressTypes.ModuleAPI.Run) {
    if ("screenshots" in run) {
      return run.screenshots;
    }
    return (run.tests ?? []).flatMap((t) =>
      t.attempts.flatMap((a) => a.screenshots)
    );
  }

  static getTests(
    run: CypressTypes.ModuleAPI.Run,
    executionState: ExecutionState
  ) {
    const tests = run.tests ?? [];

    return tests.map((test, i) => {
      const mochaAttempts = executionState
        .getAttemptsData()
        .filter((attempt) => attempt.fullTitle === test.title.join(" "));

      const testId =
        "testId" in test ? test.testId : mochaAttempts[0]?.id ?? `r${i}`;

      const runScreenshotPaths = ModuleAPIResults.getRunScreenshots(run).map(
        (i) => i.path
      );
      const testScreenshots = executionState
        .getScreenshotsData()
        // spec screenshots
        .filter((s) => runScreenshotPaths.includes(s.path))
        // test screenshots
        .filter((s) => s.testId === testId);

      const standardAttempts = (test.attempts ?? []).map(
        (cypressAttempt, j) => {
          const mochaAttempt = mochaAttempts.find(
            (ma) => ma.currentRetry === j
          );
          const attemptScreenshots = testScreenshots.filter(
            (t) => t.testAttemptIndex === j
          );
          return ModuleAPIResults.getTestAttempt(
            mochaAttempt ?? null,
            cypressAttempt,
            attemptScreenshots,
            // run only has 1 spec
            SpecAfterResult.getSpecStartedAt(run.stats)
          );
        }
      );

      return {
        body: "body" in test ? test.body : mochaAttempts[0]?.body ?? "",
        testId,
        title: test.title,
        displayError: test.displayError,
        state: test.state,
        attempts: standardAttempts,
      };
    });
  }

  /**
   * Convert version-specific attempt to a standard test attempt
   */
  static getTestAttempt(
    mochaAttempt: ExecutionStateTestAttempt | null,
    cypressAttempt: CypressTypes.ModuleAPI.TestAttempt,
    screenshots: ExecutionStateScreenshot[],
    specStartedAt: Date
  ): Standard.ModuleAPI.TestAttempt {
    if (!mochaAttempt) {
      return {
        state: cypressAttempt.state,
        error:
          "error" in cypressAttempt
            ? cypressAttempt.error
            : SpecAfterResult.getDummyTestAttemptError(cypressAttempt.state),
        startedAt:
          "startedAt" in cypressAttempt
            ? cypressAttempt.startedAt
            : new Date().toISOString(),

        duration: "duration" in cypressAttempt ? cypressAttempt.duration : 0,
        videoTimestamp:
          "videoTimestamp" in cypressAttempt
            ? cypressAttempt.videoTimestamp
            : 0,
        screenshots:
          "screenshots" in cypressAttempt
            ? cypressAttempt.screenshots
            : screenshots,
      };
    }

    return {
      state: cypressAttempt.state,
      error:
        "error" in cypressAttempt
          ? cypressAttempt.error
          : SpecAfterResult.getAttemptError(mochaAttempt.err),

      startedAt:
        "startedAt" in cypressAttempt
          ? cypressAttempt.startedAt
          : mochaAttempt.wallClockStartedAt ?? new Date().toISOString(),
      duration:
        "duration" in cypressAttempt
          ? cypressAttempt.duration
          : mochaAttempt.duration ?? -1,
      videoTimestamp:
        "videoTimestamp" in cypressAttempt
          ? cypressAttempt.videoTimestamp
          : SpecAfterResult.getAttemptVideoTimestamp(
              parseISO(mochaAttempt.wallClockStartedAt).getTime(),
              specStartedAt.getTime()
            ),
      screenshots:
        "screenshots" in cypressAttempt
          ? cypressAttempt.screenshots
          : screenshots,
    };
  }

  static getRun(
    run: CypressTypes.ModuleAPI.Run,
    executionState: ExecutionState
  ): Standard.ModuleAPI.Run {
    return {
      ...run,
      tests: ModuleAPIResults.getTests(run, executionState),
      spec: SpecAfterResult.getSpecStandard(run.spec),
      hooks: "hooks" in run ? run.hooks : [],
      shouldUploadVideo:
        "shouldUploadVideo" in run ? run.shouldUploadVideo : true,
    };
  }

  /**
   * Convert batched multi-spec result into a single-spec result
   * Converts different Cypress versions to standard form
   *
   * @param spec - relative spec path
   * @param batchResults - batched results in Module API format
   * @returns Module API results for single spec in standard format
   */
  static getRunResultPerSpec(
    spec: string,
    batchResults: CypressTypes.ModuleAPI.Result,
    executionState: ExecutionState
  ): Standard.ModuleAPI.CompletedResult | undefined {
    if (!ModuleAPIResults.isSuccessResult(batchResults)) {
      // TODO: return dummy result for missing spec results?
      return;
    }

    const run = batchResults.runs.find((r) => r.spec.relative === spec);
    if (!run) {
      return;
    }
    const stats = SpecAfterResult.getStatsStandard(run.stats);

    // standardize the result for singe spec
    return {
      ...batchResults,
      runs: [ModuleAPIResults.getRun(run, executionState)],
      totalSuites: 1,
      totalDuration: stats.wallClockDuration,
      totalTests: stats.tests,
      totalFailed: stats.failures,
      totalPassed: stats.passes,
      totalPending: stats.pending,
      totalSkipped: stats.skipped,
      startedTestsAt: stats.wallClockStartedAt,
      endedTestsAt: stats.wallClockEndedAt,
      status: "finished",
    };
  }

  static isFailureResult(
    result: CypressTypes.ModuleAPI.Result
  ): result is CypressTypes.ModuleAPI.FailureResult {
    return "status" in result && result.status === "failed";
  }

  static isSuccessResult = (
    result: CypressTypes.ModuleAPI.Result
  ): result is CypressTypes.ModuleAPI.CompletedResult => {
    if ("status" in result) {
      return result.status === "finished";
    }
    return true;
  };

  static getEmptyResult(
    config: MergedConfig
  ): Standard.ModuleAPI.CompletedResult {
    return {
      status: "finished",
      totalDuration: 0,
      totalSuites: 0,
      totalPending: 0,
      totalFailed: 0,
      totalSkipped: 0,
      totalPassed: 0,
      totalTests: 0,
      startedTestsAt: new Date().toISOString(),
      endedTestsAt: new Date().toISOString(),
      runs: [],
      // @ts-ignore
      config,
    };
  }
}
