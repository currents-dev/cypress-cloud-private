import {
  MochaError,
  MochaHook,
  MochaInvocationDetails,
  TestAttemptState,
  TestState,
  TestingType,
  Timing,
} from "./shared";

/**
 * Cypress 12.17.4 and lower shape
 */
export namespace Cypress12 {
  export namespace SpecAfter {
    export interface Payload {
      error: string | null;
      hooks: Hooks[] | null;
      reporter?: string;
      reporterStats: ReporterStats | null;
      screenshots: Screenshot[];
      spec: Spec;
      stats: Stats;
      tests: Test[] | null;
      video: string | null;
    }

    export interface Spec {
      absolute: string; // /Users/agoldis/cypress-cloud/examples/webapp/cypress/e2e/crash.spec.js
      baseName: string; // crash.spec.js
      fileExtension: string; // .js
      fileName: string; // crash
      name: string; // cypress/e2e/crash.spec.js
      relative: string; // cypress/e2e/crash.spec.js
      relativeToCommonRoot: string; // crash.spec.js
      specFileExtension: string; // .spec.js
      specType: string; // integration
    }

    export interface Screenshot {
      height: number;
      name: string | null;
      path: string;
      screenshotId: string;
      takenAt: string;
      testAttemptIndex: number;
      testId: string;
      width: number;
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

    export interface Stats {
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

    export interface Test {
      attempts: TestAttempt[];
      body: string;
      displayError: string | null;
      state: TestState;
      title: string[];
      testId: string;
    }

    export interface Hooks {
      hookId: string;
      hookName: "before each" | "after each" | "before all" | "after all";
      title: string[];
      body: string;
    }

    export interface TestAttempt {
      error: TestError | null;
      failedFromHookId: string | null;
      state: TestAttemptState;
      timings: Timing | null;
      videoTimestamp: number;
      wallClockDuration: number;
      wallClockStartedAt: string;
    }

    export interface TestError {
      message: string;
      name: string;
      stack: string;
      codeFrame: CodeFrame | null;
    }

    export interface CodeFrame {
      line: number | null;
      column: number | null;
      originalFile: string | null;
      relativeFile: string | null;
      absoluteFile: string | null;
      frame: string | null;
      language: string | null;
    }
  }

  /**
   * test:after:run event
   */
  export namespace TestAfter {
    /**
     * test:after:run event payload
     */
    export interface Payload extends TestBefore.Payload {
      duration: number;
      err?: MochaError;
      hooks: MochaHook[];
      timings: Timing;
    }
  }

  /**
   * test:before:run event
   */
  export namespace TestBefore {
    export interface Payload {
      async: boolean;
      body: string;
      currentRetry: number;
      fullTitle: string;
      hooks?: MochaHook[]; // missing for non-first attempts
      id: string;
      invocationDetails?: MochaInvocationDetails; // missing for non-first attempts
      order: number;
      pending: boolean;
      retries: number;
      state: string;
      sync: boolean;
      timedOut: boolean;
      timings: Pick<Timing, "lifecycle">;
      title: string;
      type: string;
      wallClockStartedAt: string;
    }
  }

  /**
   * screenshot:after event
   */
  export namespace ScreenshotAfter {
    export interface Payload {
      testAttemptIndex: number;
      size: number;
      takenAt: string;
      dimensions: { width: number; height: number };
      multipart: boolean;
      specName: string;
      name: string | null;
      testFailure: boolean;
      path: string;
      scaled: boolean;
      duration: number;
      blackout: string[];
    }
  }
  /**
   * Module API (cypress.run())
   */
  export namespace ModuleAPI {
    /**
     *  return value of cypress.run()
     */
    export type Result = CompletedResult | FailureResult;

    export interface FailureResult {
      status: "failed";
      failures: number;
      message: string;
    }

    export interface CompletedResult {
      browserName: string;
      browserPath: string;
      browserVersion: string;
      config: Config;
      cypressVersion: string;
      endedTestsAt: string;
      osName: string;
      osVersion: string;
      runs: Run[];
      startedTestsAt: string;
      status: "finished" | "failed";
      totalDuration: number;
      totalFailed: number;
      totalPassed: number;
      totalPending: number;
      totalSkipped: number;
      totalSuites: number;
      totalTests: number;
    }

    export interface Run {
      error: SpecAfter.Payload["error"];
      hooks: SpecAfter.Payload["hooks"];
      reporter?: SpecAfter.Payload["reporter"];
      reporterStats: SpecAfter.Payload["reporterStats"];
      shouldUploadVideo: boolean;
      spec: SpecAfter.Spec;
      stats: Stats;
      tests: Test[] | null;
      video: string | null;
    }

    export interface Test {
      title: string[];
      state: TestState;
      body: string;
      displayError: string | null;
      attempts: TestAttempt[];
    }

    export interface TestAttempt {
      state: SpecAfter.TestAttempt["state"];
      error: SpecAfter.TestAttempt["error"];
      videoTimestamp: number;
      duration: number | null;
      startedAt: string;
      screenshots: Screenshot[];
    }

    export interface Screenshot {
      name: string | null;
      takenAt: string;
      path: string;
      height: number;
      width: number;
    }

    export interface Stats {
      duration: number;
      endedAt: string;
      failures: number;
      passes: number;
      pending: number;
      skipped: number;
      startedAt: string;
      suites: number;
      tests: number;
    }

    export interface Config {
      specPattern: string;
      video: boolean;
      videoUploadOnPasses: boolean;
      version: string;
      testingType: TestingType;
    }
  }
}
