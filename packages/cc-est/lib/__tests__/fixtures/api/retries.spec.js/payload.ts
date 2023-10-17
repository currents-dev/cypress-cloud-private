import { expect } from "@jest/globals";

export const tests = {
  config: {
    videoUploadOnPasses: true,
  },
  tests: [
    {
      body: "redacted",
      title: ["Retries", "Runs a test with retries"],
      clientId: "r0",
    },
  ],
  hooks: null,
};
export const results = {
  stats: {
    duration: expect.any(Number),
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 0,
    passes: 1,
    pending: 0,
    skipped: 0,
    suites: 1,
    tests: 1,
    wallClockDuration: expect.any(Number),
    wallClockStartedAt: expect.any(String),
    wallClockEndedAt: expect.any(String),
  },
  reporterStats: {
    suites: 1,
    tests: 1,
    passes: 1,
    pending: 0,
    failures: 0,
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
      path: "/Users/agoldis/cc-est/examples/webapp/cypress/screenshots/retries.spec.js/Retries -- Runs a test with retries (failed).png",
      takenAt: expect.any(String),
      testAttemptIndex: 0,
      testId: "r0",
      screenshotId: expect.any(String),
    },
    {
      height: 1440,
      width: 2560,
      name: null,
      path: "/Users/agoldis/cc-est/examples/webapp/cypress/screenshots/retries.spec.js/Retries -- Runs a test with retries (failed) (attempt 2).png",
      takenAt: expect.any(String),
      testAttemptIndex: 1,
      testId: "r0",
      screenshotId: expect.any(String),
    },
  ],
  hasCoverage: false,
  tests: [
    {
      displayError: null,
      state: "passed",
      attempts: [
        {
          state: "failed",
          error: {
            name: "Error",
            message: "oh no!",
            stack: expect.any(String),
            codeFrame: {
              line: 11,
              column: 15,
              originalFile: "cypress/e2e/retries.spec.js",
              relativeFile: "examples/webapp/cypress/e2e/retries.spec.js",
              absoluteFile:
                "/Users/agoldis/cc-est/examples/webapp/cypress/e2e/retries.spec.js",
              frame:
                '   9 |       if (i > 1) {\n  10 |         i--;\n> 11 |         throw new Error("oh no!");\n     |               ^\n  12 |       }\n  13 |       return;\n  14 |     }',
              language: "js",
            },
          },
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
        },
        {
          state: "failed",
          error: {
            name: "Error",
            message: "oh no!",
            stack: expect.any(String),
            codeFrame: {
              line: 11,
              column: 15,
              originalFile: "cypress/e2e/retries.spec.js",
              relativeFile: "examples/webapp/cypress/e2e/retries.spec.js",
              absoluteFile:
                "/Users/agoldis/cc-est/examples/webapp/cypress/e2e/retries.spec.js",
              frame:
                '   9 |       if (i > 1) {\n  10 |         i--;\n> 11 |         throw new Error("oh no!");\n     |               ^\n  12 |       }\n  13 |       return;\n  14 |     }',
              language: "js",
            },
          },
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
        },
        {
          state: "passed",
          error: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
        },
      ],
      clientId: "r0",
    },
  ],
};
