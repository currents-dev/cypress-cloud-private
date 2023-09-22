import { expect } from "@jest/globals";

export const tests = {
  config: {
    videoUploadOnPasses: true,
  },
  tests: [
    {
      body: "redacted",
      title: ["Pending", "Pending test"],
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
    passes: 0,
    pending: 1,
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
    pending: 1,
    failures: 0,
    start: expect.any(String),
    end: expect.any(String),
    duration: expect.any(Number),
  },
  exception: null,
  video: true,
  screenshots: [],
  hasCoverage: false,
  tests: [
    {
      displayError: null,
      state: "pending",
      attempts: [
        {
          state: "pending",
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
