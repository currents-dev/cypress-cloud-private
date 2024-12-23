import { expect, jest } from "@jest/globals";
import { fetchRun, runCypressCloud } from "../../utils/utils";

import { data as apiReference } from "../data-references/ccy-1.9.4-cy-12-crapi";
import { all, config, specs } from "../data-references/ccy-1.9.4-cy-12-cycl";
const testSpecs = [
  "a.spec.js",
  "b.spec.js",
  "c.spec.js",
  "d.spec.js",
  "e.spec.js",
];
let result: any = null;

// eslint-disable-next-line
const cypressVersion = process.env.CURRENTS_USE_CYPRESS_VERSION ?? 13;
describe(`Cypress ${cypressVersion} compatibility`, () => {
  jest.setTimeout(60 * 1000 * 5);

  beforeAll(async () => {
    // import cached from "../data-references/ccy-1.10-cy-13-cycl.json";
    // save the result to a file and read from json for faster development
    // result = cached;
    result = await runCypressCloud();
  });

  describe("Run Results", () => {
    it("should have compatible summary", async () => {
      expect(result).toMatchObject({
        ...all,
        runs: expect.any(Array),
        config: expect.any(Object),
      });
    });

    it("should have the right cypress version", async () => {
      expect(result.config).toMatchObject({
        version: expect.stringContaining(`${cypressVersion}`),
      });
    });

    it("should have compatible config", async () => {
      expect(result.config).toMatchObject({
        video: config.video,
      });
    });

    testSpecs.map((spec) => {
      it(`${spec}: should be compatible`, async () => {
        // @ts-ignore
        if (!result?.status === "finished") {
          throw new Error("Test did not finish");
        }

        // @ts-ignore
        const actual = result.runs.find(
          // @ts-ignore
          (run) => run.spec.name.match(`${spec}`)
        );

        // @ts-ignore
        expect(actual).toMatchObject(specs[spec]);
      });
    });
  });

  describe("API results", () => {
    let apiRun: any = null;
    beforeAll(async () => {
      const runId = result.runUrl.split("/").pop();
      apiRun = await fetchRun(runId);
    });

    it(`should have compatible API results`, async () => {
      expect(apiRun.status).toBe("OK");
      expect(apiRun.data).toMatchObject(apiReference);
    });
  });
});
