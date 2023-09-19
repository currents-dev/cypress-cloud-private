import { expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import * as api from "../api";
import { initCapture } from "../capture";
import { listenToEvents, stopListeningToEvents } from "../listener";
import { pubsub } from "../pubsub";
import { getReportResultsTask } from "../results/uploadResults";
import { ConfigState, ExecutionState } from "../state";

jest.mock("../api", () => ({
  reportInstanceResultsMerged: jest.fn(),
  reportInstanceResults: jest.fn(),
  reportInstanceTests: jest.fn(),
}));

jest.mock("../env", () => ({
  isCurrents: jest.fn().mockReturnValue(true),
}));

const cypressVersions = ["13.2.0", "12.17.4"];
// const cypressVersions = ["12.17.4"] as const;

const specs = [
  "crash.spec.js",
  "passed.spec.js",
  "failed.spec.js",
  "pending.spec.js",
  "skipped.spec.js",
  "retries.spec.js",
] as const;

// const specs = [
//   "crash.spec.js",
//   "passing.spec.js",
//   "failed.spec.js",
//   "pending.spec.js",
//   "skipped.spec.js",
//   "retries.spec.js",
// ];

// /fixtures/12.17.4/fails.spec.js/12.17.4_fails.spec.js_specAfter
function getFixtureBase(cypressVersion: string, spec: string) {
  return path.resolve(__dirname, `./fixtures/${cypressVersion}/${spec}`);
}

function getSingleFixturePath(
  cypressVersion: string,
  spec: string,
  fixtureType: "specAfter" | "runResult"
) {
  return `${getFixtureBase(cypressVersion, spec)}/${fixtureType}.json`;
}

function getAPIPayloadPath(spec: string) {
  return `./fixtures/api/${spec}/payload.ts`;
}

function getMultipleFixtures(
  cypressVersion: string,
  spec: string,
  type: string
) {
  const files = fs.readdirSync(getFixtureBase(cypressVersion, spec));
  const imports = files
    .filter((f) => f.includes(type))
    .map((f) => import(path.resolve(getFixtureBase(cypressVersion, spec), f)));
  return Promise.all(imports);
}

describe("Data Flow", () => {
  cypressVersions.forEach((cypressVersion) => {
    describe(`Cypress ${cypressVersion}`, () => {
      specs.forEach((spec) => {
        describe(spec, () => {
          beforeEach(() => {
            stopListeningToEvents();
            jest.clearAllMocks();
          });
          it(`${spec} should have the right API call payload`, async () => {
            const instanceId = "instanceId";
            const executionState = new ExecutionState();
            const configState = new ConfigState();
            (api.reportInstanceResultsMerged as jest.Mock).mockResolvedValue(
              {}
            );
            initCapture();
            listenToEvents(configState, executionState);

            const specRelative = `cypress/e2e/${spec}`;
            const attempts = await getMultipleFixtures(
              cypressVersion,
              spec,
              "testAfter"
            );
            const screenshots = await getMultipleFixtures(
              cypressVersion,
              spec,
              "screenshot"
            );

            const specAfter = await import(
              getSingleFixturePath(cypressVersion, spec, "specAfter")
            );
            const runResult = await import(
              getSingleFixturePath(cypressVersion, spec, "runResult")
            );

            executionState.initInstance({ instanceId, spec: specRelative });
            attempts.forEach((attempt) =>
              executionState.addAttemptsData(attempt)
            );
            screenshots.forEach((screenshot) =>
              executionState.addScreenshotsData(screenshot)
            );

            pubsub.emit("cypress:runResult", {
              specRelative,
              instanceId,
              runResult,
            });
            pubsub.emit("after:spec", {
              spec: {
                relative: specRelative,
              },
              results: specAfter,
            });

            await getReportResultsTask(
              instanceId,
              executionState,
              configState,
              "",
              undefined
            );
            const actualAPIPayload = (
              api.reportInstanceResultsMerged as jest.Mock
            ).mock.calls[0][1];

            const expectedAPIPayload = await import(getAPIPayloadPath(spec));

            expect(actualAPIPayload.tests).toMatchObject(
              expectedAPIPayload.tests
            );

            expect(actualAPIPayload.results).toMatchObject(
              expectedAPIPayload.results
            );
          });
        });
      });
    });
  });
});
