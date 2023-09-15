import {
	CypressRun,
	CypressScreenshot,
	CypressTest,
	CypressTestAttempt,
} from "cypress-cloud/types";

import * as SpecAfter from "../runner/spec.type";
import { ConfigState } from "../state";
import { getFakeTestFromException } from "./results";
import _ from "lodash";

function getScreenshot(s: SpecAfter.Screenshot): CypressScreenshot {
	return {
		...s,
		name: s.name ?? "screenshot",
	};
}

function getTestAttempt(
	attempt: SpecAfter.TestAttempt,
	screenshots: SpecAfter.Screenshot[]
): CypressTestAttempt & {
	startedAt: string;
	duration: number;
	screenshots: SpecAfter.Screenshot[];
} {
	return {
		...attempt,
		startedAt: attempt.wallClockStartedAt ?? attempt.startedAt,
		duration: attempt.wallClockDuration,
		screenshots: screenshots.map(getScreenshot),
	};
}

function getTest(
	t: SpecAfter.Test,
	screenshots: SpecAfter.Screenshot[]
): CypressTest {
	const _screenshots = screenshots.filter((s) => s.testId === t.testId);
	let duration = 0;
	t.attempts.forEach((att) => {
		duration += att.duration;
	});
	return {
		...t,
		duration,
		attempts: t.attempts.map((a, i) =>
			getTestAttempt(
				a,
				_screenshots.filter((s) => s.testAttemptIndex === i)
			)
		),
	};
}

export function specResultsToCypressResults(
	configState: ConfigState,
	specAfterResult: SpecAfter.SpecResult
): CypressCommandLine.CypressRunResult {
	const stats = {
		duration:
			specAfterResult.stats.duration ??
			(specAfterResult.stats.wallClockDuration as number) ??
			0,
		endedAt:
			specAfterResult.stats.endedAt ??
			specAfterResult.stats.wallClockEndedAt ??
			new Date().toISOString(),
		startedAt:
			specAfterResult.stats.startedAt ??
			specAfterResult.stats.wallClockStartedAt ??
			new Date().toISOString(),
		failures: specAfterResult.stats.failures ?? 0,
		passes: specAfterResult.stats.passes ?? 0,
		pending: specAfterResult.stats.pending ?? 0,
		skipped: specAfterResult.stats.skipped ?? 0,
		suites: specAfterResult.stats.suites ?? 0,
		tests: specAfterResult.stats.tests ?? 0,
	};
	const config = {
		..._.cloneDeep(configState.getConfig()),
		videoUploadOnPasses: configState.getConfig()?.video,
	};
	return {
		status: "finished",
		// @ts-ignore
		config,
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
				reporterStats: specAfterResult.reporterStats ?? {},
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
					getTest(t, specAfterResult.screenshots)
				),
			},
		],
	};
}

export const backfillException = (
	result: CypressCommandLine.CypressRunResult
): CypressCommandLine.CypressRunResult => {
	return {
		...result,
		runs: result.runs.map(backfillExceptionRun),
	} as CypressCommandLine.CypressRunResult;
};

const backfillExceptionRun = (run: CypressRun) => {
	if (!run.error) {
		return run;
	}

	return {
		...run,
		tests: [getFakeTestFromException(run.error, run.stats)],
	};
};
