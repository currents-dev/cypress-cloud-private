import { expect, jest } from "@jest/globals";
import { runCypressCloud } from "../../utils/utils";
import { specs } from "../data-references/ccy-1.9.4-cy-12-cycl";
let result: any = null;
describe("Cypress 13 compatible output", () => {
  jest.setTimeout(60 * 1000 * 5);

  beforeAll(async () => {
    // result = cached;
    result = await runCypressCloud();
  });

  ["a.spec.js", "b.spec.js", "c.spec.js", "d.spec.js", "e.spec.js"].map(
    (spec) => {
      it(`should run ${spec}`, async () => {
        // @ts-ignore
        if (!result?.status === "finished") {
          throw new Error("Test did not finish");
        }

        // @ts-ignore
        const actual = result.runs.find(
          // @ts-ignore
          (run) => run.spec.name === spec
        );

        // @ts-ignore
        expect(actual).toMatchObject(specs[spec]);
      });
    }
  );
});
