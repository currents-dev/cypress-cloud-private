/**
 * Map Module API results to after:spec results
 */

import { Standard } from "../cypress.types";
import { ConfigState } from "../state";
import { getFakeTestFromException } from "./empty";

export class SpecAfterToModuleAPIMapper {
  static getTestAttempt(
    attempt: Standard.SpecAfter.TestAttempt,
    screenshots: Standard.SpecAfter.Payload["screenshots"]
  ): Standard.ModuleAPI.TestAttempt {
    return {
      ...attempt,
      duration: attempt.wallClockDuration,
      startedAt: attempt.wallClockStartedAt,
      screenshots,
    };
  }

  static getTest(
    t: Standard.SpecAfter.Test,
    screenshots: Standard.SpecAfter.Payload["screenshots"]
  ): Standard.ModuleAPI.Test {
    return {
      ...t,
      attempts: t.attempts.map((a, i) =>
        SpecAfterToModuleAPIMapper.getTestAttempt(
          a,
          screenshots.filter(
            (s) => s.testId === t.testId && s.testAttemptIndex === i
          )
        )
      ),
    };
  }

  static convert(
    specAfterResult: Standard.SpecAfter.Payload,
    configState: ConfigState
  ): Standard.ModuleAPI.CompletedResult {
    const stats = {
      duration: specAfterResult.stats.wallClockDuration,
      endedAt: specAfterResult.stats.wallClockEndedAt,
      startedAt: specAfterResult.stats.wallClockStartedAt,
      failures: specAfterResult.stats.failures ?? 0,
      passes: specAfterResult.stats.passes ?? 0,
      pending: specAfterResult.stats.pending ?? 0,
      skipped: specAfterResult.stats.skipped ?? 0,
      suites: specAfterResult.stats.suites ?? 0,
      tests: specAfterResult.stats.tests ?? 0,
    };
    return {
      status: "finished",
      // @ts-ignore
      config: configState.getConfig(),
      totalDuration: stats.duration,
      totalSuites: stats.suites,
      totalTests: stats.tests,
      totalFailed: stats.failures,
      totalPassed: stats.passes,
      totalPending: stats.pending,
      totalSkipped: stats.skipped ?? 0,
      startedTestsAt: stats.startedAt,
      endedTestsAt: stats.endedAt,
      runs: [
        {
          stats,
          reporter: specAfterResult.reporter,
          reporterStats: specAfterResult.reporterStats ?? null,
          spec: specAfterResult.spec,
          error: specAfterResult.error,
          video: specAfterResult.video,
          // @ts-ignore
          shouldUploadVideo: true, // not really used
          // @ts-ignore
          // wrong typedef for CypressCommandLine.CypressRunResult
          // actual HookName is "before all" | "before each" | "after all" | "after each"
          hooks: specAfterResult.hooks,
          tests: (specAfterResult.tests ?? []).map((t) =>
            SpecAfterToModuleAPIMapper.getTest(t, specAfterResult.screenshots)
          ),
        },
      ],
    };
  }

  static backfillException(
    result: Standard.ModuleAPI.CompletedResult
  ): Standard.ModuleAPI.CompletedResult {
    return {
      ...result,
      runs: result.runs.map(SpecAfterToModuleAPIMapper.backfillExceptionRun),
    };
  }

  static backfillExceptionRun(run: Standard.ModuleAPI.Run) {
    if (!run.error) {
      return run;
    }

    return {
      ...run,
      tests: [getFakeTestFromException(run.error, run.stats)],
    };
  }
}
