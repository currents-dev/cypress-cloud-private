import { parseISO } from "date-fns";
import _ from "lodash";
import { SpecResult } from "../runner/spec.type";
import { ExecutionState } from "../state";

function getAttemptError(err: any) {
  if (!err) {
    return null;
  }
  return {
    name: err.name,
    message: `${err.name}: ${err.message}`,
    stack: err.stack,
    codeFrame: err.codeFrame,
  };
}

function parseScreenshotResults(results: any, allScreenshots?: any[]) {
  if (!allScreenshots?.length) {
    return results;
  }

  return {
    ..._.cloneDeep(results),
    screenshots: results.screenshots.map(
      (specScreenshot: any) =>
        allScreenshots?.find(
          (screenshot) => screenshot.path === specScreenshot.path
        )
    ),
  };
}

function getAttemptVideoTimestamp(
  attemptStartedAtMs: number,
  specStartedAtMs: number
) {
  return Math.max(attemptStartedAtMs - specStartedAtMs, 0);
}
function getSpecResults(specResults: SpecResult, attempts?: any[]) {
  if (!attempts) {
    return specResults;
  }

  const enhancedTestList = (specResults.tests ?? []).map(
    (test: any, i: number) => {
      const testFullTitle = test.title.join(" ");
      const standaloneAttempts = attempts.filter(
        (attempt) => attempt.fullTitle === testFullTitle
      );
      test.attempts = standaloneAttempts.map((attempt) => ({
        state: attempt.state,
        error: getAttemptError(attempt.err),
        timings: attempt.timings,
        wallClockStartedAt: attempt.wallClockStartedAt,
        wallClockDuration: attempt.duration,
        videoTimestamp: getAttemptVideoTimestamp(
          parseISO(attempt.wallClockStartedAt).getTime(),
          parseISO(specResults.stats.startedAt).getTime()
        ),
      }));
      test.testId = standaloneAttempts[0]?.id ?? `r${i}}`;
      return test;
    }
  );

  return {
    ..._.cloneDeep(specResults),
    tests: enhancedTestList,
  };
}

/**
 * Combine standaline attempts and screenshots into unified result
 * @param specResult - spec:after results
 * @param executionState - ccy execution state
 * @returns unified results, including attempts and screenshot details
 */
export function getCombinedSpecResult(
  specResult: SpecResult,
  executionState: ExecutionState
) {
  return parseScreenshotResults(
    getSpecResults(specResult, executionState.getAttemptsData()),
    executionState.getScreenshotsData()
  );
}
