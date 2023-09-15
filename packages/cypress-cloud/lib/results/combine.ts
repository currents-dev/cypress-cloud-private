import { parseISO } from "date-fns";
import _ from "lodash";
import { SpecResult } from "../runner/spec.type";
import { ExecutionState } from "../state";
import Cypress from "cypress";

function getAttemptError(err: any) {
	if (!err) {
		return null;
	}
	return {
		name: err.name,
		message: err.message,
		stack: err.stack.split(err.message)[1].replace(/\n/g, ""),
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
function getSpecResults(
	specResults: SpecResult,
	cypressVersion: string,
	attempts?: any[]
) {
	if (!attempts) {
		return {
			..._.cloneDeep(specResults),
			spec: {
				..._.cloneDeep(specResults.spec),
				baseName: specResults.spec.name,
			},
			hooks: "hooks",
		};
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
				body: attempt.body,
				wallClockStartedAt: attempt.wallClockStartedAt,
				wallClockDuration: attempt.duration,
				videoTimestamp: getAttemptVideoTimestamp(
					parseISO(attempt.wallClockStartedAt).getTime(),
					parseISO(specResults.stats.startedAt).getTime()
				),
			}));
			test.testId = standaloneAttempts[0]?.id ?? `r${i}`;
			test.body = standaloneAttempts[0]?.body;
			return test;
		}
	);
	const specNameSplitted = specResults.spec.name.split(".");
	Cypress.cli.parseRunArguments;

	const cypressMainVersion = cypressVersion.split(".")[0];

	if (parseFloat(cypressMainVersion) <= 12) {
		return {
			..._.cloneDeep(specResults),
			tests: enhancedTestList,
			hooks: [],
		};
	}

	return {
		..._.cloneDeep(specResults),
		tests: enhancedTestList,
		spec: {
			..._.cloneDeep(specResults.spec),
			baseName: specResults.spec.name,
			specFileExtension: "." + specNameSplitted.slice(1).join("."),
			relativeToCommonRoot: specResults.spec.name,
			specType: "integration",
			name: specResults.spec.relative,
		},
		hooks: [],
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
	executionState: ExecutionState,
	cypressVersion: string
) {
	return parseScreenshotResults(
		getSpecResults(
			specResult,
			cypressVersion,
			executionState.getAttemptsData()
		),
		executionState.getScreenshotsData()
	);
}
