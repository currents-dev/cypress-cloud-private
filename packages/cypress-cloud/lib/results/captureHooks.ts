import { ExecutionState, TestAfterTaskPayload } from "../state";

export function handleScreenshotEvent(
  screenshot: Cypress.ScreenshotDetails,
  executionState: ExecutionState
) {
  const testId = executionState.getCurrentTestID();
  const screenshotData = {
    ...screenshot,
    testId,
    height: screenshot.dimensions.height,
    width: screenshot.dimensions.width,
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
  const test: TestAfterTaskPayload = JSON.parse(testAttempt);
  executionState.setAttemptsData(test);
}
