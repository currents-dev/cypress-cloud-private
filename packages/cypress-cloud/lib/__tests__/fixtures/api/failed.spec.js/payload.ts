import { expect } from "@jest/globals";
export const tests = {
  config: {
    videoUploadOnPasses: false,
  },
  tests: [
    {
      body: "redacted",
      title: ["Failed", "should fail"],
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
    failures: 1,
    passes: 0,
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
      screenshotId: expect.any(String),
      name: null,
      testId: "r0",
      testAttemptIndex: 0,
      takenAt: expect.any(String),
      path: "/Users/agoldis/cypress-cloud/examples/webapp/cypress/screenshots/failed.spec.js/Failed -- should fail (failed).png",
      height: 1440,
      width: 2560,
    },
  ],
  hasCoverage: false,
  tests: [
    {
      displayError:
        "ReferenceError: fail is not defined\n    at Context.eval (webpack://web/./cypress/e2e/failed.spec.js:3:11)",
      state: "failed",
      attempts: [
        {
          state: "failed",
          error: {
            name: "ReferenceError",
            message: "fail is not defined",
            stack: expect.any(String),
            codeFrame: {
              line: 3,
              column: 12,
              originalFile: "cypress/e2e/failed.spec.js",
              relativeFile: "examples/webapp/cypress/e2e/failed.spec.js",
              absoluteFile:
                "/Users/agoldis/cypress-cloud/examples/webapp/cypress/e2e/failed.spec.js",
              frame:
                '  1 | describe("Failed", function () {\n  2 |   it("should fail", function () {\n> 3 |     expect(fail).to.be.true;\n    |            ^\n  4 |   });\n  5 | });\n  6 | ',
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
  ],
};
