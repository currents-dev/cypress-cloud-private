import _ from "lodash";
import { MergedConfig } from "../config";
import { Standard } from "../cypress.types";
import { emptyStats } from "./empty";
import { ModuleAPIResults } from "./moduleAPIResult";

export const summarizeExecution = (
  input: Standard.ModuleAPI.CompletedResult[],
  config: MergedConfig
): Standard.ModuleAPI.CompletedResult => {
  if (!input.length) {
    return ModuleAPIResults.getEmptyResult(config);
  }

  const overall = input.reduce(
    (
      acc,
      {
        totalDuration,
        totalFailed,
        totalPassed,
        totalPending,
        totalSkipped,
        totalTests,
        totalSuites,
      }
    ) => ({
      totalDuration: acc.totalDuration + totalDuration,
      totalSuites: acc.totalSuites + totalSuites,
      totalPending: acc.totalPending + totalPending,
      totalFailed: acc.totalFailed + totalFailed,
      totalSkipped: acc.totalSkipped + totalSkipped,
      totalPassed: acc.totalPassed + totalPassed,
      totalTests: acc.totalTests + totalTests,
    }),
    emptyStats
  );
  const firstResult = input[0];
  const startItems = input.map((i) => i.startedTestsAt).sort();
  const endItems = input.map((i) => i.endedTestsAt).sort();
  const runs = input.map((i) => i.runs).flat();
  return {
    ...overall,
    runs,
    startedTestsAt: _.first(startItems) as string,
    endedTestsAt: _.last(endItems) as string,
    ..._.pick(
      firstResult,
      "browserName",
      "browserVersion",
      "browserPath",
      "osName",
      "osVersion",
      "cypressVersion",
      "config"
    ),
    status: "finished",
  };
};
