import { expect } from "@jest/globals";
export const tests = {
  config: {
    videoUploadOnPasses: false,
  },
  tests: [{ body: "redacted", title: ["Unknown"], clientId: "r0" }],
  hooks: null,
};
export const results = {
  stats: {
    duration: 0,
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 1,
    passes: 0,
    pending: 0,
    skipped: 0,
    suites: 0,
    tests: 1,
    wallClockDuration: 0,
    wallClockStartedAt: expect.any(String),
    wallClockEndedAt: expect.any(String),
  },
  reporterStats: null,
  exception: expect.any(String),
  video: true,
  screenshots: [],
  hasCoverage: false,
  tests: [
    {
      displayError: "Oops...we found an error preparing this test file:",
      state: "failed",
      attempts: [
        {
          state: "failed",
          error: {
            name: "Error",
            message: "Oops...we found an error preparing this test file:",
            stack: expect.any(String),
            codeFrame: null,
          },
          wallClockStartedAt: expect.any(String),
          wallClockDuration: 0,
          videoTimestamp: 0,
        },
      ],
      clientId: "r0",
    },
  ],
};
