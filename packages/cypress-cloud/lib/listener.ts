import chalk from "chalk";
import Debug from "debug";

import { getCapturedOutput } from "./capture";
import { getCoverageFilePath } from "./coverage";
import { CypressTypes } from "./cypress.types";
import { getSpecShortName, writeDataToFile } from "./debug-data";
import { format } from "./log";
import { pubsub } from "./pubsub";
import {
  handleScreenshotEvent,
  handleTestAfter,
  handleTestBefore,
} from "./results/captureHooks";
import { ModuleAPIResults } from "./results/moduleAPIResult";
import { SpecAfterResult } from "./results/specAfterResult";
import { createReportTaskSpec } from "./runner";
import { ConfigState, ExecutionState } from "./state";

const debug = Debug("currents:events");

const events = [
  "cypress:runResult",
  "test:after:run",
  "test:before:run",
  "after:screenshot",
  "after:spec",
];
export function stopListeningToEvents() {
  events.forEach((e) => pubsub.removeAllListeners(e));
}
export function listenToEvents(
  configState: ConfigState,
  executionState: ExecutionState,
  experimentalCoverageRecording?: boolean
) {
  const config = configState.getConfig();

  pubsub.on(
    "cypress:runResult",
    ({
      instanceId,
      runResult,
      specRelative,
    }: {
      specRelative: string;
      instanceId: string;
      runResult: CypressTypes.ModuleAPI.CompletedResult;
    }) => {
      // % save results
      writeDataToFile(
        JSON.stringify(runResult),
        getSpecShortName(specRelative),
        "runResult"
      );
      debug("cypress:runResult %s: %o", instanceId, runResult);
      executionState.setInstanceResult(
        instanceId,
        ModuleAPIResults.getStandardResult(runResult, executionState)
      );
    }
  );

  pubsub.on("test:after:run", (payload: string) => {
    debug("test:after:run %o", payload);
    handleTestAfter(payload, executionState);
  });

  pubsub.on("test:before:run", (payload: string) => {
    debug("test:before:run %o", payload);
    handleTestBefore(payload, executionState);
  });

  pubsub.on(
    "after:screenshot",
    (screenshot: CypressTypes.EventPayload.ScreenshotAfter) => {
      debug("after:screenshot %o", screenshot);
      handleScreenshotEvent(screenshot, executionState);
    }
  );

  pubsub.on(
    "after:spec",
    async ({
      spec,
      results,
    }: {
      spec: CypressTypes.EventPayload.SpecAfter.Spec;
      results: CypressTypes.EventPayload.SpecAfter.Payload;
    }) => {
      // % save results
      const s = getSpecShortName(spec.relative);
      writeDataToFile(JSON.stringify(results), s, "specAfter");

      debug("after:spec %s %o", spec.relative, results);
      executionState.setSpecAfter(
        spec.relative,
        SpecAfterResult.getSpecAfterStandard(results, executionState)
      );
      executionState.setSpecOutput(spec.relative, getCapturedOutput());

      if (experimentalCoverageRecording) {
        const { path, error } = await getCoverageFilePath(
          config?.env?.coverageFile
        );

        if (!error) {
          executionState.setSpecCoverage(spec.relative, path);
        } else {
          executionState.addWarning(
            format(
              `Error reading coverage file "%s". Coverage recording will be skipped.\n${chalk.dim(
                `Error: %s`
              )}`,
              path,
              error
            )
          );
        }
      }
      createReportTaskSpec(configState, executionState, spec.relative);
    }
  );
}
