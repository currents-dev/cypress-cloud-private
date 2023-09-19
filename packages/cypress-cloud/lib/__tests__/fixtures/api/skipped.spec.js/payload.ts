import { expect } from "@jest/globals";

export const tests = {
  config: {
    videoUploadOnPasses: false,
  },
  tests: [
    {
      body: "redacted",
      title: ["Skipped", "should not be skipped"],
      clientId: "r0",
    },
    {
      body: "redacted",
      title: ["Skipped", "should be skipped"],
      clientId: "r1",
    },
  ],
  hooks: null,
};

export const results = {
  stats: {
    duration: expect.any(Number),
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 1,
    passes: 0,
    pending: 0,
    skipped: 1,
    suites: 1,
    tests: 2,
    wallClockDuration: expect.any(Number),
    wallClockStartedAt: expect.any(String),
    wallClockEndedAt: expect.any(String),
  },
  reporterStats: {
    suites: 1,
    tests: 1,
    passes: 0,
    pending: 0,
    failures: 1,
    start: expect.any(String),
    end: expect.any(String),
    duration: expect.any(Number),
  },
  exception: null,
  video: true,
  screenshots: [
    {
      height: 1440,
      width: 2560,
      name: null,
      path: "/Users/agoldis/cypress-cloud/examples/webapp/cypress/screenshots/skipped.spec.js/Skipped -- should not be skipped -- before each hook (failed).png",
      takenAt: expect.any(String),
      testAttemptIndex: 0,
      testId: "r0",
      screenshotId: expect.any(String),
    },
  ],
  hasCoverage: false,
  tests: [
    {
      displayError:
        "Error: before each exception\n\nBecause this error occurred during a `before each` hook we are skipping the remaining tests in the current suite: `Skipped`\n    at Context.eval (webpack://web/./cypress/e2e/skipped.spec.js:3:10)",
      state: "failed",
      attempts: [
        {
          state: "failed",
          error: {
            name: "Error",
            message:
              "before each exception\n\nBecause this error occurred during a `before each` hook we are skipping the remaining tests in the current suite: `Skipped`",
            stack: expect.any(String),
            codeFrame: {
              line: 3,
              column: 11,
              originalFile: "cypress/e2e/skipped.spec.js",
              relativeFile: "examples/webapp/cypress/e2e/skipped.spec.js",
              absoluteFile:
                "/Users/agoldis/cypress-cloud/examples/webapp/cypress/e2e/skipped.spec.js",
              frame:
                '  1 | describe("Skipped", function () {\n  2 |   beforeEach(function () {\n> 3 |     throw new Error("before each exception");\n    |           ^\n  4 |   });\n  5 |   it("should not be skipped", function () {\n  6 |     expect(true).to.be.true;',
              language: "js",
            },
          },
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
        },
      ],
      clientId: "r0",
    },
    {
      displayError: null,
      state: "skipped",
      attempts: [
        {
          state: "skipped",
          error: {
            name: "Error",
            message: "The test was skipped because of a hook failure",
            stack: "",
            codeFrame: null,
          },
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
        },
      ],
      clientId: "r1",
    },
  ],
};
