import { Platform, ScreenshotArtifact } from "@currents/cc-est/types";
import { Standard } from "../../cypress.types";
import { TestAttemptState, TestState } from "../../cypress.types/shared";

export namespace InstanceAPIPayload {
  export interface Screenshot {
    screenshotId: string;
    name: string | null;
    testId: string;
    takenAt: string;
    height: number;
    width: number;
    screenshotURL: string;
  }

  export interface InstanceResultStats {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    skipped: number;
    failures: number;
    wallClockStartedAt: string;
    wallClockEndedAt: string;
    wallClockDuration: number;
  }

  export interface ReporterStats {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    failures: number;
    start: string;
    end: string;
    duration: number;
  }

  export interface CypressConfig {
    video: boolean;
    videoUploadOnPasses: boolean;
    [key: string]: any;
  }

  export interface InstanceResult {
    stats: InstanceResultStats;
    tests: Test[];
    error?: string;
    reporterStats: ReporterStats;
    exception: null | string;
    cypressConfig?: PickedCypressConfig | null;
    screenshots: Screenshot[];
    video: boolean;
    videoUrl?: string;
    hasCoverage?: boolean;
  }

  export interface AssetUploadInstruction {
    uploadUrl: string;
    readUrl: string;
  }

  export interface ScreenshotUploadInstruction extends AssetUploadInstruction {
    screenshotId: string;
  }

  export type SetResultsTestsPayload = Pick<
    Test,
    "state" | "displayError" | "attempts"
  > & { clientId: string };

  export interface SetInstanceTestsPayload {
    config: PickedCypressConfig;
    tests: Array<SetTestsPayload>;
    hooks: Standard.ModuleAPI.Run["hooks"];
  }

  export type PickedCypressConfig = Pick<
    CypressConfig,
    "video" | "videoUploadOnPasses"
  >;

  export type CreateInstancePayload = {
    runId: string;
    groupId: string;
    machineId: string;
    platform: Platform;
  };

  export type CreateInstanceCyPayload = CreateInstancePayload & {
    batchSize: number;
  };
  export type CreateInstanceResponse = {
    spec: string | null;
    instanceId: string | null;
    claimedInstances: number;
    totalInstances: number;
  };

  export type InstanceResponseSpecDetails = {
    spec: string;
    instanceId: string;
  };
  export type CreateInstancesResponse = {
    specs: Array<InstanceResponseSpecDetails>;
    claimedInstances: number;
    totalInstances: number;
  };

  export type UpdateInstanceResultsPayload = Pick<
    InstanceResult,
    "stats" | "exception" | "video" | "hasCoverage"
  > & {
    tests: Array<SetResultsTestsPayload> | null;
  } & {
    reporterStats: CypressCommandLine.RunResult["reporterStats"] | null;
  } & {
    screenshots: ScreenshotArtifact[];
  };

  export type UpdateInstanceResultsMergedPayload = {
    tests: SetInstanceTestsPayload;
    results: UpdateInstanceResultsPayload;
  };

  export interface UpdateInstanceResultsResponse {
    videoUploadUrl?: string | null;
    screenshotUploadUrls: ScreenshotUploadInstruction[];
    coverageUploadUrl?: string | null;
    cloud?: {
      shouldCancel: false | string;
    };
  }

  export interface TestAttempt {
    state: TestAttemptState;
    error: Standard.ModuleAPI.TestAttempt["error"] | null;
    wallClockStartedAt: string | null;
    wallClockDuration: number | null;
    videoTimestamp: number | null;
  }

  interface TestConfig {
    retries:
      | {
          openMode: number;
          runMode: number;
        }
      | number;
  }

  export interface TestHook {
    clientId: string;
    type: "before each";
    title: string[];
    body: string;
  }

  export interface Test {
    state: TestState;
    testId: string;
    displayError: string | null;
    title: string[];
    config?: null | TestConfig;
    body: string;
    attempts: TestAttempt[];
  }

  export type SetTestsPayload = Pick<Test, "body" | "title" | "config"> & {
    clientId: string;
  };
}
