import Debug from "debug";
import {
  InstanceAPIPayload,
  reportInstanceResultsMerged,
  setInstanceTests,
  updateInstanceResults,
} from "../api";
import { uploadArtifacts, uploadStdoutSafe } from "../artifacts";
import { setCancellationReason } from "../cancellation";
import { getInitialOutput } from "../capture";
import { isCurrents } from "../env";
import { ConfigState, ExecutionState } from "../state";
import { getInstanceResultPayload, getInstanceTestsPayload } from "./api";

const debug = Debug("currents:results");

export async function getReportResultsTask(
  instanceId: string,
  executionState: ExecutionState,
  configState: ConfigState,
  stdout: string,
  coverageFilePath?: string
) {
  const results = executionState.getInstanceResults(configState, instanceId);
  const run = results.runs[0];
  if (!run) {
    throw new Error("No run found in Cypress results");
  }
  const instanceResults = getInstanceResultPayload(run, coverageFilePath);
  const instanceTests = getInstanceTestsPayload(run, configState);

  // % save results
  // writeDataToFile(
  //   JSON.stringify({
  //     tests: instanceTests,
  //     results: instanceResults,
  //   }),
  //   getSpecShortName(results.runs[0].spec.relative),
  //   "apiCall"
  // );

  const { videoUploadUrl, screenshotUploadUrls, coverageUploadUrl, cloud } =
    await reportResults(instanceId, instanceTests, instanceResults);

  if (cloud?.shouldCancel) {
    debug("instance %s should cancel", instanceId);
    setCancellationReason(cloud.shouldCancel);
  }

  debug("instance %s artifact upload instructions %o", instanceId, {
    videoUploadUrl,
    screenshotUploadUrls,
    coverageUploadUrl,
  });

  return Promise.all([
    uploadArtifacts({
      executionState,
      videoUploadUrl,
      videoPath: run.video,
      screenshotUploadUrls,
      screenshots: instanceResults.screenshots,
      coverageUploadUrl,
      coverageFilePath,
    }),
    uploadStdoutSafe(instanceId, getInitialOutput() + stdout),
  ]);
}

async function reportResults(
  instanceId: string,
  instanceTests: InstanceAPIPayload.SetInstanceTestsPayload,
  instanceResults: InstanceAPIPayload.UpdateInstanceResultsPayload
) {
  debug("reporting instance %s results...", instanceId);
  if (isCurrents()) {
    return reportInstanceResultsMerged(instanceId, {
      tests: instanceTests,
      results: instanceResults,
    });
  }

  // run one after another
  await setInstanceTests(instanceId, instanceTests);
  return updateInstanceResults(instanceId, instanceResults);
}
