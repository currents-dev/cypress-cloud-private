/**
 * Transforms cypress payloads from various versions to a single standard
 */

import { parseISO } from "date-fns";
import { match } from "ts-pattern";
import { CypressTypes, Standard } from "../cypress.types";
import { MochaError } from "../cypress.types/shared";
import { warn } from "../log";
import { getRandomString } from "../nano";
import { ExecutionState, ExecutionStateTestAttempt } from "../state";

export class SpecAfterResult {
  /**
   * Combine standalone attempts and screenshots into standard result
   * @param specResult - spec:after results
   * @param executionState - ccy execution state
   * @returns unified results, including attempts and screenshot details
   */
  static getSpecAfterStandard(
    specAfterResults: CypressTypes.EventPayload.SpecAfter.Payload,
    executionState: ExecutionState
  ) {
    return {
      error: specAfterResults.error,
      // hooks: "hooks" in specAfterResults ? specAfterResults.hooks : null,
      hooks: null,
      reporter: specAfterResults.reporter,
      reporterStats: specAfterResults.reporterStats,
      spec: SpecAfterResult.getSpecStandard(specAfterResults.spec),
      tests: SpecAfterResult.getTestStandard(
        specAfterResults,
        executionState.getAttemptsData()
      ),
      video: specAfterResults.video,
      stats: SpecAfterResult.getStatsStandard(specAfterResults.stats),
      screenshots: SpecAfterResult.getScreenshotsStandard(
        specAfterResults.screenshots,
        executionState.getScreenshotsData()
      ),
    };
  }

  static getAttemptError(err?: MochaError | null) {
    if (!err) {
      return null;
    }
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      codeFrame: err.codeFrame,
    };
  }

  static getAttemptVideoTimestamp(
    attemptStartedAtMs: number,
    specStartedAtMs: number
  ) {
    return Math.max(attemptStartedAtMs - specStartedAtMs, 0);
  }

  static getSpecStartedAt(
    stats: CypressTypes.EventPayload.SpecAfter.Payload["stats"]
  ): Date {
    if ("startedAt" in stats) {
      return parseISO(stats.startedAt);
    }
    if ("wallClockStartedAt" in stats) {
      return parseISO(stats.wallClockStartedAt);
    }

    warn("Cannot determine spec start date from stats: %o", stats);
    return new Date();
  }

  static getDummyTestAttemptError(
    attemptState: "passed" | "skipped" | "pending" | "failed"
  ) {
    return match(attemptState)
      .with("failed", () => ({
        name: "Error",
        message:
          "[@currents/cc-est] Could not get cypress attempt error details",
        stack: "",
        codeFrame: null,
      }))
      .with("skipped", () => ({
        name: "Error",
        message: "The test was skipped because of a hook failure",
        stack: "",
        codeFrame: null,
      }))
      .otherwise(() => null);
  }

  private static getTestAttemptStandard(
    mochaAttempt: ExecutionStateTestAttempt | null,
    cypressAttempt: CypressTypes.EventPayload.SpecAfter.TestAttempt,
    specStartedAt: Date
  ): Standard.SpecAfter.TestAttempt {
    if (!mochaAttempt) {
      const error = "error" in cypressAttempt ? cypressAttempt.error : null;
      const duration =
        "wallClockDuration" in cypressAttempt
          ? cypressAttempt.wallClockDuration
          : null;
      return {
        state: cypressAttempt.state,
        error: error
          ? error
          : SpecAfterResult.getDummyTestAttemptError(cypressAttempt.state),
        timings: "timings" in cypressAttempt ? cypressAttempt.timings : null,
        wallClockStartedAt:
          "wallClockStartedAt" in cypressAttempt
            ? cypressAttempt.wallClockStartedAt
            : new Date().toISOString(),

        wallClockDuration: duration ? duration : 0,
        failedFromHookId:
          "failedFromHookId" in cypressAttempt
            ? cypressAttempt.failedFromHookId
            : null,
        videoTimestamp:
          "videoTimestamp" in cypressAttempt
            ? cypressAttempt.videoTimestamp
            : 0,
      };
    }

    return {
      state: cypressAttempt.state,
      error:
        "error" in cypressAttempt
          ? cypressAttempt.error
          : SpecAfterResult.getAttemptError(mochaAttempt.err),
      timings:
        "timings" in cypressAttempt
          ? cypressAttempt.timings
          : mochaAttempt.timings,
      wallClockStartedAt:
        mochaAttempt.wallClockStartedAt ?? new Date().toISOString(),
      wallClockDuration: mochaAttempt.duration ?? -1,
      failedFromHookId:
        "failedFromHookId" in cypressAttempt
          ? cypressAttempt.failedFromHookId
          : null,
      videoTimestamp:
        "videoTimestamp" in cypressAttempt
          ? cypressAttempt.videoTimestamp
          : SpecAfterResult.getAttemptVideoTimestamp(
              parseISO(mochaAttempt.wallClockStartedAt).getTime(),
              specStartedAt.getTime()
            ),
    };
  }

  private static getTestStandard(
    specAfterResults: CypressTypes.EventPayload.SpecAfter.Payload,
    attempts: ExecutionState["attemptsData"]
  ) {
    const standardTestList: Standard.SpecAfter.Payload["tests"] = (
      specAfterResults.tests ?? []
    ).map((test, i) => {
      const mochaAttempts = attempts.filter(
        (attempt) => attempt.fullTitle === test.title.join(" ")
      );

      const standardAttempts = (test.attempts ?? []).map(
        (cypressAttempt, j) => {
          const mochaAttempt = mochaAttempts.find(
            (ma) => ma.currentRetry === j
          );
          return SpecAfterResult.getTestAttemptStandard(
            mochaAttempt ?? null,
            cypressAttempt,
            SpecAfterResult.getSpecStartedAt(specAfterResults.stats)
          );
        }
      );

      return {
        body: "body" in test ? test.body : mochaAttempts[0]?.body ?? "",
        testId:
          "testId" in test ? test.testId : mochaAttempts[0]?.id ?? `r${i}`,
        title: test.title,
        displayError: test.displayError,
        state: test.state,
        attempts: standardAttempts,
      };
    });
    return standardTestList;
  }

  static getSpecStandard(
    spec: CypressTypes.EventPayload.SpecAfter.Spec
  ): Standard.SpecAfter.Spec {
    return {
      name: spec.name,
      relative: spec.relative,
      absolute: spec.absolute,
      fileExtension: spec.fileExtension,
      baseName: "baseName" in spec ? spec.baseName : "",
      fileName: "fileName" in spec ? spec.fileName : "",
      relativeToCommonRoot:
        "relativeToCommonRoot" in spec ? spec.relativeToCommonRoot : "",
      specFileExtension:
        "specFileExtension" in spec ? spec.specFileExtension : "",
      specType: "specType" in spec ? spec.specType : "",
    };
  }

  static getStatsStandard(
    stats: CypressTypes.EventPayload.SpecAfter.Stats
  ): Standard.SpecAfter.Stats {
    const result = {
      skipped: stats.skipped,
      suites: stats.suites,
      tests: stats.tests,
      passes: stats.passes,
      pending: stats.pending,
      failures: stats.failures,
      wallClockStartedAt:
        "wallClockStartedAt" in stats
          ? stats.wallClockStartedAt
          : stats.startedAt,
      wallClockEndedAt:
        "wallClockEndedAt" in stats ? stats.wallClockEndedAt : stats.endedAt,
      wallClockDuration:
        "wallClockDuration" in stats
          ? stats.wallClockDuration
          : stats.duration ?? 0,
    };

    // fix wrong total for crashed runs - e.g. when cypress fails to compile
    result.tests =
      result.passes + result.failures + result.pending + result.skipped;

    return result;
  }

  private static getScreenshotsStandard(
    specAfterScreenshots: CypressTypes.EventPayload.SpecAfter.Payload["screenshots"],
    screenshotEvents: ExecutionState["screenshotsData"]
  ): Standard.SpecAfter.Payload["screenshots"] {
    if (!specAfterScreenshots.length) {
      return [];
    }

    return specAfterScreenshots.map((specScreenshot) => {
      const es = screenshotEvents.find(
        (screenshot) => screenshot.path === specScreenshot.path
      );
      if (!es) {
        warn(
          'Could not find details for screenshot at path "%s", skipping...',
          specScreenshot.path
        );
      }
      return {
        height: specScreenshot.height,
        width: specScreenshot.width,
        name: specScreenshot.name ?? es?.name ?? null,
        path: specScreenshot.path,
        takenAt: specScreenshot.takenAt,
        testAttemptIndex:
          "testAttemptIndex" in specScreenshot
            ? specScreenshot.testAttemptIndex
            : es?.testAttemptIndex ?? -1,
        testId:
          "testId" in specScreenshot
            ? specScreenshot.testId
            : es?.testId ?? "unknown",
        screenshotId:
          "screenshotId" in specScreenshot
            ? specScreenshot.screenshotId
            : getRandomString(),
      };
    });
  }
}
