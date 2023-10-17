import { Cypress12 } from "./12";
import { TestAttemptState, TestState, TestingType } from "./shared";

export namespace Cypress13 {
  export namespace SpecAfter {
    export interface Payload {
      error: string | null; // ✅
      reporter: string; // ✅
      reporterStats: ReporterStats | null; // ✅
      screenshots: Screenshot[]; // ✅
      spec: Spec; // ✅
      stats: Stats; // ✅
      tests: Test[] | null; // ✅
      video: string | null; // ✅
    }

    export interface Spec {
      absolute: string; // /Users/agoldis/cc-est/examples/webapp/cypress/e2e/crash.spec.js
      fileExtension: string; // .js
      fileName: string; // crash
      name: string; // crash.spec.js
      relative: string; // cypress/e2e/crash.spec.js
    }

    export interface Screenshot {
      height: number;
      name: string | null;
      path: string;
      screenshotId: string;
      takenAt: string;
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
      startedAt: string;
      endedAt: string;
      duration?: number; // node_modules/cypress/types/cypress-npm-api.d.ts
    }

    export interface Test {
      attempts: TestAttempt[];
      displayError: string | null;
      state: TestState;
      duration: number;
      title: string[];
    }

    export interface TestAttempt {
      state: TestAttemptState;
    }
  }

  export namespace TestAfter {
    export interface Payload extends Cypress12.TestAfter.Payload {}
  }

  export namespace TestBefore {
    export interface Payload extends Cypress12.TestBefore.Payload {}
  }

  export namespace ScreenshotAfter {
    export interface Payload extends Cypress12.ScreenshotAfter.Payload {}
  }

  // return value of cypress.run()
  export namespace ModuleAPI {
    export type Result = CompletedResult | FailureResult;

    export interface FailureResult extends Cypress12.ModuleAPI.FailureResult {}
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
      reporter?: SpecAfter.Payload["reporter"];
      reporterStats: SpecAfter.Payload["reporterStats"];
      spec: SpecAfter.Spec;
      screenshots: Screenshot[];
      stats: Stats;
      tests: Test[] | null;
      video: string | null;
    }

    export interface Screenshot {
      height: number;
      name: string | null;
      path: string;
      takenAt: string;
      width: number;
    }
    export interface Config {
      specPattern: string;
      video: boolean;
      videoUploadOnPasses: boolean;
      version: string;
      testingType: TestingType;
    }

    export interface Stats extends Cypress12.ModuleAPI.Stats {}
    export interface Test {
      displayError: string | null;
      duration: number;
      state: TestState;
      title: string[];
      attempts: TestAttempt[];
    }

    export interface TestAttempt extends Cypress13.SpecAfter.TestAttempt {}
  }
}
