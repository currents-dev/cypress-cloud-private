import { makeRequest } from "../httpClient";
import {
  CreateRunPayload,
  CreateRunResponse,
  InstanceAPIPayload,
} from "./types";
import { printWarnings } from "./warnings";

export const createRun = async (payload: CreateRunPayload) => {
  const response = await makeRequest<CreateRunResponse, CreateRunPayload>({
    method: "POST",
    url: "/runs",
    data: payload,
  });

  if ((response.data.warnings?.length ?? 0) > 0) {
    printWarnings(response.data.warnings);
  }

  return response.data;
};

export const createInstance = async ({
  runId,
  groupId,
  machineId,
  platform,
}: InstanceAPIPayload.CreateInstancePayload) => {
  const response = await makeRequest<
    InstanceAPIPayload.CreateInstanceResponse,
    InstanceAPIPayload.CreateInstancePayload
  >({
    method: "POST",
    url: `runs/${runId}/instances`,
    data: {
      runId,
      groupId,
      machineId,
      platform,
    },
  });

  return response.data;
};

export const createBatchedInstances = async (
  data: InstanceAPIPayload.CreateInstanceCyPayload
) => {
  const respone = await makeRequest<
    InstanceAPIPayload.CreateInstancesResponse,
    InstanceAPIPayload.CreateInstanceCyPayload
  >({
    method: "POST",
    url: `runs/${data.runId}/cy/instances`,
    data,
  });

  return respone.data;
};

export const setInstanceTests = (
  instanceId: string,
  payload: InstanceAPIPayload.SetInstanceTestsPayload
) =>
  makeRequest<{}, InstanceAPIPayload.SetInstanceTestsPayload>({
    method: "POST",
    url: `instances/${instanceId}/tests`,
    data: payload,
  }).then((result) => result.data);

export const updateInstanceResults = (
  instanceId: string,
  payload: InstanceAPIPayload.UpdateInstanceResultsPayload
) =>
  makeRequest<
    InstanceAPIPayload.UpdateInstanceResultsResponse,
    InstanceAPIPayload.UpdateInstanceResultsPayload
  >({
    method: "POST",
    url: `instances/${instanceId}/results`,
    data: payload,
  }).then((result) => result.data);

export const reportInstanceResultsMerged = (
  instanceId: string,
  payload: InstanceAPIPayload.UpdateInstanceResultsMergedPayload
) =>
  makeRequest<
    InstanceAPIPayload.UpdateInstanceResultsResponse,
    InstanceAPIPayload.UpdateInstanceResultsMergedPayload
  >({
    method: "POST",
    url: `instances/${instanceId}/cy/results`,
    data: payload,
  }).then((result) => result.data);

export const updateInstanceStdout = (instanceId: string, stdout: string) =>
  makeRequest<any, { stdout: string }>({
    method: "PUT",
    url: `instances/${instanceId}/stdout`,
    data: {
      stdout,
    },
  });

export const getDebugUrl = ({
  runId,
  type,
}: {
  runId: string;
  type: string;
}) => {
  return makeRequest<
    { uploadUrl: string; readUrl: string },
    { runId: string; type: string }
  >({
    // comment for local
    baseURL: "https://cy.currents.dev",
    method: "POST",
    url: `runs/debug-logs`,
    data: {
      type,
      runId,
    },
  }).then((result) => result.data);
};
