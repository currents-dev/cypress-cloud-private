import { CypressTypes } from "../cypress.types";
import {
  getScreenshotCount,
  getTestHookSpecName,
  writeDataToFile,
} from "../debug-data";
import { ExecutionState } from "../state";

export function handleScreenshotEvent(
  screenshot: CypressTypes.EventPayload.ScreenshotAfter,
  executionState: ExecutionState
) {
  const data = {
    ...screenshot,
    testId: executionState.getCurrentTestID(),
    height: screenshot.dimensions.height,
    width: screenshot.dimensions.width,
  };
  // % save results
  writeDataToFile(
    JSON.stringify(data),
    `${screenshot.specName}`,
    `screenshot`,
    `_0${getScreenshotCount(screenshot.specName)}`
  );

  executionState.addScreenshotsData(data);
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

  // % save results
  writeDataToFile(
    testAttempt,
    getTestHookSpecName(test),
    "testAfter",
    `_0${test.currentRetry}`
  );

  executionState.addAttemptsData(test);
}
