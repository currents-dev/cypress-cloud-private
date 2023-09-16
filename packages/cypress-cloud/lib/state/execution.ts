import { InstanceId } from "cypress-cloud/types";
import { error, warn } from "../log";
import { getFailedFakeInstanceResult } from "../results/empty";
import { SpecAfterToModuleAPIMapper } from "../results/mapResult";

import Debug from "debug";
import { Cypress12, CypressTypes, Standard } from "../cypress.types";
import { ConfigState } from "./config";
const debug = Debug("currents:state");

type InstanceExecutionState = {
  instanceId: InstanceId;
  spec: string;
  output?: string;
  specBefore?: Date;
  createdAt: Date;
  runResults?: Standard.ModuleAPI.CompletedResult;
  runResultsReportedAt?: Date;
  specAfter?: Date;
  specAfterResults?: Cypress12.SpecAfter.Payload;
  reportStartedAt?: Date;
  coverageFilePath?: string;
};

export type ExecutionStateScreenshot =
  CypressTypes.EventPayload.ScreenshotAfter & {
    testId?: string;
    testAttemptIndex: number;
    width: number;
    height: number;
  };
export type ExecutionStateTestAttempt = CypressTypes.EventPayload.TestAfter;

export class ExecutionState {
  private attemptsData: ExecutionStateTestAttempt[] = [];
  private screenshotsData: ExecutionStateScreenshot[] = [];
  private currentTestID?: string;
  private state: Record<InstanceId, InstanceExecutionState> = {};

  public getResults(
    configState: ConfigState
  ): Standard.ModuleAPI.CompletedResult[] {
    return Object.values(this.state).map((i) =>
      this.getInstanceResults(configState, i.instanceId)
    );
  }

  public getInstance(instanceId: InstanceId) {
    return this.state[instanceId];
  }

  public getSpec(spec: string) {
    return Object.values(this.state).find((i) => i.spec === spec);
  }

  public initInstance({
    instanceId,
    spec,
  }: {
    instanceId: InstanceId;
    spec: string;
  }) {
    debug('Init execution state for "%s"', spec);
    this.state[instanceId] = {
      instanceId,
      spec,
      createdAt: new Date(),
    };
  }

  public setSpecBefore(spec: string) {
    const i = this.getSpec(spec);
    if (!i) {
      warn('Cannot find execution state for spec "%s"', spec);
      return;
    }

    i.specBefore = new Date();
  }

  public setSpecCoverage(spec: string, coverageFilePath: string) {
    const i = this.getSpec(spec);
    if (!i) {
      warn('Cannot find execution state for spec "%s"', spec);
      return;
    }

    debug("Experimental: coverageFilePath was set");
    i.coverageFilePath = coverageFilePath;
  }

  public setSpecAfter(spec: string, results: Standard.SpecAfter.Payload) {
    const i = this.getSpec(spec);
    if (!i) {
      warn('Cannot find execution state for spec "%s"', spec);
      return;
    }
    i.specAfter = new Date();
    i.specAfterResults = results;
  }

  public setSpecOutput(spec: string, output: string) {
    const i = this.getSpec(spec);
    if (!i) {
      warn('Cannot find execution state for spec "%s"', spec);
      return;
    }
    this.setInstanceOutput(i.instanceId, output);
  }

  public setInstanceOutput(instanceId: string, output: string) {
    const i = this.state[instanceId];
    if (!i) {
      warn('Cannot find execution state for instance "%s"', instanceId);
      return;
    }
    if (i.output) {
      debug('Instance "%s" already has output', instanceId);
      return;
    }
    i.output = output;
  }

  public setInstanceResult(
    instanceId: string,
    runResults: Standard.ModuleAPI.CompletedResult
  ) {
    const i = this.state[instanceId];
    if (!i) {
      warn('Cannot find execution state for instance "%s"', instanceId);
      return;
    }
    i.runResults = {
      ...runResults,
      status: "finished",
    };
    i.runResultsReportedAt = new Date();
  }

  public getInstanceResults(
    configState: ConfigState,
    instanceId: string
  ): Standard.ModuleAPI.CompletedResult {
    const i = this.getInstance(instanceId);

    if (!i) {
      error('Cannot find execution state for instance "%s"', instanceId);

      return getFailedFakeInstanceResult(configState, {
        specs: ["unknown"],
        error: "Cannot find execution state for instance",
      });
    }

    // use spec:after results - it can become available before run results
    if (i.specAfterResults) {
      debug('Using spec:after results for %s "%s"', instanceId, i.spec);
      return SpecAfterToModuleAPIMapper.backfillException(
        SpecAfterToModuleAPIMapper.convert(i.specAfterResults, configState)
      );
    }

    if (i.runResults) {
      debug('Using runResults for %s "%s"', instanceId, i.spec);
      return SpecAfterToModuleAPIMapper.backfillException(i.runResults);
    }

    debug('No results detected for "%s"', i.spec);
    return getFailedFakeInstanceResult(configState, {
      specs: [i.spec],
      error: `No results detected for the spec file. That usually happens because of cypress crash. See the console output for details.`,
    });
  }

  public addAttemptsData(attemptDetails: CypressTypes.EventPayload.TestAfter) {
    this.attemptsData.push(attemptDetails);
  }

  public getAttemptsData() {
    return this.attemptsData;
  }

  public addScreenshotsData(screenshotsData: ExecutionStateScreenshot) {
    this.screenshotsData.push(screenshotsData);
  }

  public getScreenshotsData() {
    return this.screenshotsData;
  }

  public setCurrentTestID(testID: string) {
    this.currentTestID = testID;
  }

  public getCurrentTestID() {
    return this.currentTestID;
  }
}
