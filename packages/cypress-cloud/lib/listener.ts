import { Debug } from "./remote-debug";

import { CypressTypes } from "./cypress.types";
import { Event, allEvents, getPubSub } from "./pubsub";
import {
  handleScreenshotEvent,
  handleSpecAfter,
  handleTestAfter,
  handleTestBefore,
} from "./results/captureHooks";
import { ModuleAPIResults } from "./results/moduleAPIResult";
import { ConfigState, ExecutionState } from "./state";

const debug = Debug("currents:events");

export function stopListeningToEvents() {
  allEvents.forEach((e) => getPubSub().removeAllListeners(e));
}
export function listenToEvents(
  configState: ConfigState,
  executionState: ExecutionState,
  experimentalCoverageRecording: boolean = false
) {
  getPubSub().on(Event.DEBUG, (payload: string) => {
    debug("%s: %o", Event.DEBUG, payload);
  });
  getPubSub().on(
    Event.RUN_RESULT,
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
      // writeDataToFile(
      //   JSON.stringify(runResult),
      //   getSpecShortName(specRelative),
      //   "runResult"
      // );
      debug(
        "%s %s %s: %o",
        Event.RUN_RESULT,
        instanceId,
        specRelative,
        runResult
      );
      executionState.setInstanceResult(
        instanceId,
        ModuleAPIResults.getStandardResult(runResult, executionState)
      );
    }
  );

  getPubSub().on(Event.TEST_AFTER_RUN, (payload: string) => {
    debug("%s %o", Event.TEST_AFTER_RUN, payload);
    handleTestAfter(payload, executionState);
  });

  getPubSub().on(Event.TEST_BEFORE_RUN, (payload: string) => {
    debug("%s %o", Event.TEST_BEFORE_RUN, payload);
    handleTestBefore(payload, executionState);
  });

  getPubSub().on(
    Event.AFTER_SCREENSHOT,
    (screenshot: CypressTypes.EventPayload.ScreenshotAfter) => {
      debug("%s %o", Event.AFTER_SCREENSHOT, screenshot);
      handleScreenshotEvent(screenshot, executionState);
    }
  );

  getPubSub().on(
    Event.AFTER_SPEC,
    async ({
      spec,
      results,
    }: {
      spec: CypressTypes.EventPayload.SpecAfter.Spec;
      results: CypressTypes.EventPayload.SpecAfter.Payload;
    }) => {
      await handleSpecAfter({
        spec,
        results,
        executionState,
        configState,
        experimentalCoverageRecording,
      });
    }
  );
}
