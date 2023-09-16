import { CypressTypes } from "../cypress.types";
import { ExecutionState } from "../state";

export function handleScreenshotEvent(
  screenshot: CypressTypes.EventPayload.ScreenshotAfter,
  executionState: ExecutionState
) {
  executionState.addScreenshotsData({
    ...screenshot,
    testId: executionState.getCurrentTestID(),
    height: screenshot.dimensions.height,
    width: screenshot.dimensions.width,
  });
}

export function handleTestBefore(
  testAttempt: string,
  executionState: ExecutionState
) {
  const parsed: CypressTypes.EventPayload.TestBefore = JSON.parse(testAttempt);
  executionState.setCurrentTestID(parsed.id);
}

export function handleTestAfter(
  testAttempt: string,
  executionState: ExecutionState
) {
  const test: CypressTypes.EventPayload.TestAfter = JSON.parse(testAttempt);
  executionState.addAttemptsData(test);
}
