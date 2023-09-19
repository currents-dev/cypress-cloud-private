import { run } from "cypress-cloud";

export function getCurrentsTestsVariables() {
  const projectId = process.env.CURRENTS_PROJECT_ID;
  const recordKey = process.env.CURRENTS_RECORD_KEY;
  const ciBuildId = `run-compat-test-${new Date().toISOString()}`;
  const apiKey =
    // eslint-disable-next-line
    process.env.CURRENTS_API_KEY;
  const apiBaseUrl =
    // eslint-disable-next-line
    process.env.CURRENTS_API_BASE_URL || "https://api.currents.dev/v1";
  return {
    projectId,
    recordKey,
    ciBuildId,
    apiKey,
    apiBaseUrl,
  };
}

export async function fetchRun(runId: string) {
  const { apiKey, apiBaseUrl } = getCurrentsTestsVariables();
  const headers = new Headers({
    Authorization: `Bearer ${apiKey}`,
  });

  const response = await fetch(`${apiBaseUrl}/runs/${runId}`, {
    method: "GET",
    headers,
  });
  return response.json();
}

export async function runCypressCloud() {
  const { ciBuildId } = getCurrentsTestsVariables();
  return await run({
    ciBuildId,
    batchSize: 5,
  });
}
