import {
  SpecWithRelativeRoot,
  ValidatedCurrentsParameters,
} from "cypress-cloud/types";
import { getCapturedOutput, resetCapture } from "../capture";

import { ModuleAPIResults } from "../results/moduleAPIResult";

import Debug from "debug";
import {
  InstanceAPIPayload,
  createBatchedInstances,
  createInstance,
} from "../api";

import { runSpecFileSafe } from "../cypress";
import { CypressTypes } from "../cypress.types";
import { isCurrents } from "../env";
import { divider, info, title, warn } from "../log";
import { Event, getPubSub } from "../pubsub";
import { ConfigState, ExecutionState } from "../state";
import { createReportTask, reportTasks } from "./reportTask";

const debug = Debug("currents:runner");

export async function runTillDone(
  executionState: ExecutionState,
  configState: ConfigState,
  {
    runId,
    groupId,
    machineId,
    platform,
    specs: allSpecs,
  }: InstanceAPIPayload.CreateInstancePayload & {
    specs: SpecWithRelativeRoot[];
  },
  params: ValidatedCurrentsParameters
) {
  let hasMore = true;

  while (hasMore) {
    const newTasks = await runBatch(executionState, configState, {
      runMeta: {
        runId,
        groupId,
        machineId,
        platform,
      },
      allSpecs,
      params,
    });
    if (!newTasks.length) {
      debug("No more tasks to run. Uploads queue: %d", reportTasks.length);
      hasMore = false;
      break;
    }
    newTasks.forEach((t) =>
      createReportTask(configState, executionState, t.instanceId)
    );
  }
}

async function runBatch(
  executionState: ExecutionState,
  configState: ConfigState,
  {
    runMeta,
    params,
    allSpecs,
  }: {
    runMeta: {
      runId: string;
      groupId: string;
      machineId: string;
      platform: InstanceAPIPayload.CreateInstancePayload["platform"];
    };
    allSpecs: SpecWithRelativeRoot[];
    params: ValidatedCurrentsParameters;
  }
) {
  let batch = {
    specs: [] as InstanceAPIPayload.InstanceResponseSpecDetails[],
    claimedInstances: 0,
    totalInstances: 0,
  };

  if (isCurrents()) {
    debug("Getting batched tasks: %d", params.batchSize);
    batch = await createBatchedInstances({
      ...runMeta,
      batchSize: params.batchSize,
    });
    debug("Got batched tasks: %o", batch);
  } else {
    const response = await createInstance(runMeta);

    if (response.spec !== null && response.instanceId !== null) {
      batch.specs.push({
        spec: response.spec,
        instanceId: response.instanceId,
      });
    }
    batch.claimedInstances = response.claimedInstances;
    batch.totalInstances = response.totalInstances;
  }

  if (batch.specs.length === 0) {
    return [];
  }

  /**
   * Batch can have multiple specs. While running the specs,
   * cypress can hard-crash without reporting any result.
   *
   * When crashed, ideally, we need to:
   * - determine which spec crashed
   * - associate the crash with the spec
   * - run the rest of unreported specs in the batch
   *
   * But detecting the crashed spec is error-prone and inaccurate,
   * so we fall back to reporting hard crash to all subsequent
   * specs in the batch.
   *
   * Worst-case scenario: we report hard crash to all specs in the batch.
   */

  // %state
  batch.specs.forEach((i) => executionState.initInstance(i));

  divider();
  info(
    "Running: %s (%d/%d)",
    batch.specs.map((s) => s.spec).join(", "),
    batch.claimedInstances,
    batch.totalInstances
  );

  const batchedResult = await runSpecFileSafe(
    {
      // use absolute paths - user can run the program from a different directory, e.g. nx or a monorepo workspace
      // cypress still report the path relative to the project root
      spec: batch.specs
        .map((bs) => getSpecAbsolutePath(allSpecs, bs.spec))
        .join(","),
    },
    params
  );

  title("blue", "Reporting results and artifacts in background...");

  const output = getCapturedOutput();

  batch.specs.forEach((spec) => {
    executionState.setInstanceOutput(spec.instanceId, output);

    const singleSpecResult = getSingleSpecRunResult(spec.spec, batchedResult);
    if (!singleSpecResult) {
      return;
    }

    getPubSub().emit(Event.RUN_RESULT, {
      specRelative: spec.spec,
      instanceId: spec.instanceId,
      runResult: singleSpecResult,
    });
  });

  resetCapture();

  return batch.specs;
}

function getSingleSpecRunResult(
  specRelative: string,
  batchedResult: CypressTypes.ModuleAPI.Result
): CypressTypes.ModuleAPI.CompletedResult | undefined {
  if (!ModuleAPIResults.isSuccessResult(batchedResult)) {
    // TODO: return dummy result for missing spec results?
    return;
  }

  const run = batchedResult.runs.find((r) => r.spec.relative === specRelative);
  if (!run) {
    return;
  }

  return {
    ...batchedResult,
    // @ts-ignore
    runs: [run],
  };
}

function getSpecAbsolutePath(
  allSpecs: SpecWithRelativeRoot[],
  relative: string
) {
  const absolutePath = allSpecs.find((i) => i.relative === relative)?.absolute;
  if (!absolutePath) {
    warn(
      'Cannot find absolute path for spec. Spec: "%s", candidates: %o',
      relative,
      allSpecs
    );
    throw new Error(`Cannot find absolute path for spec`);
  }
  return absolutePath;
}
