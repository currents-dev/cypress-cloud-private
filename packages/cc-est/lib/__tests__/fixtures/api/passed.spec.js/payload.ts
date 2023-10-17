import { expect } from "@jest/globals";

export const tests = {
  config: {
    videoUploadOnPasses: true,
  },
  tests: [
    {
      body: "redacted",
      title: ["Passed", "should pass"],
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
      height: 1320,
      width: 2000,
      name: "custom-screenshot",
      path: "/Users/agoldis/cc-est/examples/webapp/cypress/screenshots/passed.spec.js/Passed -- should pass.png",
      takenAt: expect.any(String),
      testAttemptIndex: 0,
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
