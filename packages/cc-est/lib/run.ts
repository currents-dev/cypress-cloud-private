import "./init";

import Debug from "debug";
import { getLegalNotice } from "../legal";
import { CurrentsRunParameters } from "../types";
import { createRun } from "./api";
import { cutInitialOutput } from "./capture";
import { getCI } from "./ciProvider";
import {
  getMergedConfig,
  isOffline,
  preprocessParams,
  validateParams,
} from "./config";
import { runBareCypress } from "./cypress";
import { activateDebug } from "./debug";
import { isCurrents } from "./env";
import { getGitInfo } from "./git";
import { setAPIBaseUrl } from "./httpClient";
import { listenToEvents } from "./listener";
import { bold, dim, divider, info, spacer, title } from "./log";
import { getPlatform } from "./platform";
import { summarizeExecution, summaryTable } from "./results";
import { reportTasks, runTillDoneOrCancelled } from "./runner";
import { shutdown } from "./shutdown";
import { getSpecFiles } from "./specMatcher";
import { ConfigState, ExecutionState } from "./state";
import { _currentsVersion, _cypressVersion, setRunId } from "./state/global";
import { printWarnings } from "./warnings";
import { startWSS } from "./ws";

const debug = Debug("currents:run");

export async function run(params: CurrentsRunParameters = {}) {
  const executionState = new ExecutionState();
  const configState = new ConfigState();

  activateDebug(params.cloudDebug);

  debug("run params %o", params);
  params = preprocessParams(params);
  debug("params after preprocess %o", params);

  if (isOffline(params)) {
    info(`Skipping cloud orchestration because --record is set to false`);
    return runBareCypress(params);
  }

  const validatedParams = await validateParams(params);
  setAPIBaseUrl(validatedParams.cloudServiceUrl);

  if (!isCurrents()) {
    console.log(getLegalNotice());
  }

  const {
    recordKey,
    projectId,
    group,
    parallel,
    ciBuildId,
    tag,
    testingType,
    batchSize,
    autoCancelAfterFailures,
    experimentalCoverageRecording,
  } = validatedParams;

  const config = await getMergedConfig(validatedParams);
  configState.setConfig(config?.resolved);

  const { specs, specPattern } = await getSpecFiles({
    config,
    params: validatedParams,
  });

  if (specs.length === 0) {
    return;
  }

  const platform = await getPlatform({
    config,
    browser: validatedParams.browser,
  });

  info(`cc-est version: ${dim(_currentsVersion)}`);
  info(`Cypress version: ${dim(_cypressVersion)}`);
  info("Discovered %d spec files", specs.length);
  info(
    `Tags: ${tag.length > 0 ? tag.join(",") : false}; Group: ${
      group ?? false
    }; Parallel: ${parallel ?? false}; Batch Size: ${batchSize}`
  );
  info("Connecting to cloud orchestration service...");

  const run = await createRun({
    ci: getCI(ciBuildId),
    specs: specs.map((spec) => spec.relative),
    commit: await getGitInfo(config.projectRoot),
    group,
    platform,
    parallel: parallel ?? false,
    ciBuildId,
    projectId,
    recordKey,
    specPattern: [specPattern].flat(2),
    tags: tag,
    testingType,
    batchSize,
    autoCancelAfterFailures,
    coverageEnabled: experimentalCoverageRecording,
  });

  setRunId(run.runId);
  info("🎥 Run URL:", bold(run.runUrl));
  cutInitialOutput();

  await startWSS();
  listenToEvents(
    configState,
    executionState,
    config.experimentalCoverageRecording
  );

  await runTillDoneOrCancelled(
    executionState,
    configState,
    {
      runId: run.runId,
      groupId: run.groupId,
      machineId: run.machineId,
      platform,
      specs,
    },
    validatedParams
  );

  divider();

  await Promise.allSettled(reportTasks);
  const _summary = summarizeExecution(
    executionState.getResults(configState),
    config
  );

  title("white", "Cloud Run Finished");
  console.log(summaryTable(_summary));

  printWarnings(executionState);

  info("\n🏁 Recorded Run:", bold(run.runUrl));

  await shutdown();

  spacer();

  return {
    ..._summary,
    runUrl: run.runUrl,
  };
}
