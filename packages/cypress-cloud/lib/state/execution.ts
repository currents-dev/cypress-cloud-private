import { InstanceId } from "cypress-cloud/types";
import { error, warn } from "../log";
import { getFailedDummyResult } from "../results";
import {
  backfillException,
  specResultsToCypressResults,
} from "../results/mapResult";
import { SpecResult } from "../runner/spec.type";

import Debug from "debug";
import { ConfigState } from "./config";
const debug = Debug("currents:state");

type InstanceExecutionState = {
  instanceId: InstanceId;
  spec: string;
  output?: string;
  specBefore?: Date;
  createdAt: Date;
  runResults?: CypressCommandLine.CypressRunResult;
  runResultsReportedAt?: Date;
  specAfter?: Date;
  specAfterResults?: SpecResult;
  reportStartedAt?: Date;
  coverageFilePath?: string;
  specFileData?: SpecResult;
};

export type TestAfterTaskPayload = {
  async: boolean;
  body: string;
  duration: number;
  err: MochaError;
  final: boolean;
  hooks: HookData[];
  id: string;
  invocationDetails: InvocationDetails;
  order: number;
  pending: boolean;
  retries: number;
  state: string;
  sync: boolean;
  timedOut: boolean;
  timings: Timing;
  type: string;
  wallClockStartedAt: string;
  title: string;
  currentRetry: string;
  fullTitle: string;
};

interface ParsedStackItem {
  message: string;
  whitespace: string;
  function?: string;
  fileUrl?: string;
  originalFile?: string;
  relativeFile?: string;
  absoluteFile?: string;
  line?: number;
  column?: number;
}

interface CodeFrame {
  line: number;
  column: number;
  originalFile: string;
  relativeFile: string;
  absoluteFile: string;
  frame: string;
  language: string;
}

export interface MochaError {
  message: string;
  name: string;
  stack: string;
  parsedStack: ParsedStackItem[];
  codeFrame: CodeFrame;
}

interface InvocationDetails {
  function: string;
  fileUrl: string;
  originalFile: string;
  relativeFile: string;
  absoluteFile: string;
  line: number;
  column: number;
  whitespace: string;
  stack: string;
}

interface HookData {
  title: string;
  hookName: string;
  hookId: string;
  pending: boolean;
  body: string;
  type: string;
  file: null | string;
  invocationDetails: InvocationDetails;
  currentRetry: number;
  retries: number;
  _slow: number;
}

interface TimingDetail {
  hookId: string;
  fnDuration: number;
  afterFnDuration: number;
}

interface TestTiminDetail {
  fnDuration: number;
  afterFnDuration: number;
}

interface Timing {
  lifecycle: number;
  "before each": TimingDetail[];
  test: TestTiminDetail;
  "after each": TimingDetail[];
}

export type AfterScreenshotPayload = {
  testAttemptIndex: number;
  size: number;
  takenAt: string;
  dimensions: { width: number; height: number };
  multipart: boolean;
  specName: string;
  testFailure: boolean;
  path: string;
  scaled: boolean;
  duration: number;
};

export class ExecutionState {
  private attemptsData: TestAfterTaskPayload[] = [];
  private screenshotsData: AfterScreenshotPayload[] = [];
  private currentTestID?: string;
  private state: Record<InstanceId, InstanceExecutionState> = {};

  public getResults(configState: ConfigState) {
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

  public setSpecAfter(spec: string, results: SpecResult) {
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
    results: CypressCommandLine.CypressRunResult
  ) {
    const i = this.state[instanceId];
    if (!i) {
      warn('Cannot find execution state for instance "%s"', instanceId);
      return;
    }
    i.runResults = results;
    i.runResultsReportedAt = new Date();
  }

  public getInstanceResults(configState: ConfigState, instanceId: string) {
    const i = this.getInstance(instanceId);

    if (!i) {
      error('Cannot find execution state for instance "%s"', instanceId);

      return getFailedDummyResult(configState, {
        specs: ["unknown"],
        error: "Cannot find execution state for instance",
      });
    }

    // use spec:after results - it can become available before run results
    if (i.specAfterResults) {
      debug('Using spec:after results for %s "%s"', instanceId, i.spec);
      return backfillException(
        specResultsToCypressResults(configState, i.specAfterResults)
      );
    }

    if (i.runResults) {
      debug('Using runResults for %s "%s"', instanceId, i.spec);
      return backfillException(i.runResults);
    }

    debug('No results detected for "%s"', i.spec);
    return getFailedDummyResult(configState, {
      specs: [i.spec],
      error: `No results detected for the spec file. That usually happens because of cypress crash. See the console output for details.`,
    });
  }

  public setAttemptsData(attemptDetails: TestAfterTaskPayload) {
    this.attemptsData.push(attemptDetails);
  }

  public getAttemptsData(): TestAfterTaskPayload[] | undefined {
    return this.attemptsData;
  }

  public setScreenshotsData(screenshotsData: AfterScreenshotPayload) {
    this.screenshotsData.push(screenshotsData);
  }

  public getScreenshotsData(): AfterScreenshotPayload[] | undefined {
    return this.screenshotsData;
  }

  public setCurrentTestID(testID: string) {
    this.currentTestID = testID;
  }

  public getCurrentTestID(): string | undefined {
    return this.currentTestID;
  }
}
