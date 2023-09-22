import Debug from "debug";
import { getCapturedOutput } from "../capture";
import { getCoverageFilePath } from "../coverage";
import { CypressTypes } from "../cypress.types";
import { dim } from "../log";
import { createReportTaskSpec } from "../runner";
import { ConfigState, ExecutionState } from "../state";
import { SpecAfterResult } from "./specAfterResult";

const debug = Debug("currents:events");

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
  //   writeDataToFile(
  //     JSON.stringify(data),
  //     `${screenshot.specName}`,
  //     `screenshot`,
  //     `_0${getScreenshotCount(screenshot.specName)}`
  //   );

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
  //   writeDataToFile(
  //     testAttempt,
  //     getTestHookSpecName(test),
  //     "testAfter",
  //     `_0${test.currentRetry}`
  //   );

  executionState.addAttemptsData(test);
}

export async function handleSpecAfter({
  executionState,
  configState,
  spec,
  results,
  experimentalCoverageRecording = false,
}: {
  executionState: ExecutionState;
  configState: ConfigState;
  spec: CypressTypes.EventPayload.SpecAfter.Spec;
  results: CypressTypes.EventPayload.SpecAfter.Payload;
  experimentalCoverageRecording: boolean;
}) {
  // % save results
  //   const s = getSpecShortName(spec.relative);
  //   writeDataToFile(JSON.stringify(results), s, "specAfter");

  debug("after:spec %s %o", spec.relative, results);
  executionState.setSpecAfter(
    spec.relative,
    SpecAfterResult.getSpecAfterStandard(results, executionState)
  );
  executionState.setSpecOutput(spec.relative, getCapturedOutput());
  const config = configState.getConfig();

  if (experimentalCoverageRecording) {
    const config = configState.getConfig();

    const { path, error } = await getCoverageFilePath(
      config?.env?.coverageFile
    );

    if (!error) {
      executionState.setSpecCoverage(spec.relative, path);
    } else {
      executionState.addWarning(
        `Error reading coverage file "${path}". Coverage recording will be skipped.\n${dim(
          error
        )}`
      );
    }
  }
  createReportTaskSpec(configState, executionState, spec.relative);
}
