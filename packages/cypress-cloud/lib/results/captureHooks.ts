import { ExecutionState } from "../state";
import { generateRandomString } from "../utils";

export function handleScreenshotEvent(
	screenshot: Cypress.ScreenshotDetails & { testAttemptIndex: number },
	executionState: ExecutionState
) {
	const testId = executionState.getCurrentTestID();
	const screenshotData = {
		...screenshot,
		testId,
		height: screenshot.dimensions.height,
		width: screenshot.dimensions.width,
		screenshotId: generateRandomString(6),
	};
	executionState.setScreenshotsData(screenshotData);
}

export function handleTestBefore(
	testAttempt: string,
	executionState: ExecutionState
) {
	executionState.setCurrentTestID(JSON.parse(testAttempt).id);
}

export function handleTestAfter(
	testAttempt: string,
	executionState: ExecutionState
) {
	const test = JSON.parse(testAttempt);
	const {
		title,
		body,
		retries,
		_currentRetry,
		pending,
		type,
		invocationDetails,
		id,
		hooks,
		order,
		wallClockStartedAt,
		timings,
		_events,
		_eventsCount,
		duration,
		err,
		state,
		fullTitle,
	} = test;
	const attempt = {
		title,
		fullTitle,
		body,
		retries,
		_currentRetry,
		pending,
		type,
		invocationDetails,
		id,
		hooks,
		order,
		wallClockStartedAt,
		timings,
		_events,
		_eventsCount,
		duration,
		err,
		state,
	};
	executionState.setAttemptsData(attempt);
}
