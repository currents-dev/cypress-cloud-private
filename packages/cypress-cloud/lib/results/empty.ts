import { Standard } from "../cypress.types";
import { ConfigState } from "../state";

export const emptyStats = {
  totalDuration: 0,
  totalSuites: 0,
  totalPending: 0,
  totalFailed: 0,
  totalSkipped: 0,
  totalPassed: 0,
  totalTests: 0,
};

const getDummyFailedTest = (
  start: string,
  error: string
): Standard.ModuleAPI.Test => ({
  title: ["Unknown"],
  state: "failed",
  body: "// This test is automatically generated due to execution failure",
  displayError: error,
  attempts: [
    {
      state: "failed",
      startedAt: start,
      duration: 0,
      videoTimestamp: 0,
      screenshots: [],
      error: {
        name: "CypressExecutionError",
        message: error,
        stack: "",
        codeFrame: null,
      },
    },
  ],
});

export function getFailedFakeInstanceResult(
  configState: ConfigState,
  {
    specs,
    error,
  }: {
    specs: string[];
    error: string;
  }
): Standard.ModuleAPI.CompletedResult {
  const start = new Date().toISOString();
  const end = new Date().toISOString();
  return {
    // @ts-ignore
    config: configState.getConfig() ?? {},
    status: "finished",
    startedTestsAt: new Date().toISOString(),
    endedTestsAt: new Date().toISOString(),
    totalDuration: 0,
    totalSuites: 1,
    totalFailed: 1,
    totalPassed: 0,
    totalPending: 0,
    totalSkipped: 0,
    totalTests: 1,
    browserName: "unknown",
    browserVersion: "unknown",
    browserPath: "unknown",
    osName: "unknown",
    osVersion: "unknown",
    cypressVersion: "unknown",
    runs: specs.map((s) => ({
      stats: {
        suites: 1,
        tests: 1,
        passes: 0,
        pending: 0,
        skipped: 0,
        failures: 1,
        startedAt: start,
        endedAt: end,
        duration: 0,
      },
      reporter: "spec",
      reporterStats: {
        suites: 1,
        tests: 1,
        passes: 0,
        pending: 0,
        failures: 1,
        start: start,
        end: end,
        duration: 0,
      },
      hooks: [],
      error,
      video: null,
      spec: {
        name: s,
        relative: s,
        absolute: s,
        relativeToCommonRoot: s,
        baseName: s,
        specType: "integration",
        fileExtension: "js",
        fileName: s,
        specFileExtension: "js",
      },
      tests: [getDummyFailedTest(start, error)],
      shouldUploadVideo: false,
      skippedSpec: false,
    })),
  };
}
