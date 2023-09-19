import { expect, jest } from "@jest/globals";
import { runCypressCloud } from "../../utils/utils";
import { specA } from "../data-references/ccy-1.9.4-cy-12-cycl";

describe("Run", () => {
  jest.setTimeout(60 * 1000 * 5);
  it("should run", async () => {
    const result = await runCypressCloud();

    // @ts-ignore
    if (!result?.status === "finished") {
      throw new Error("Test did not finish");
    }

    // @ts-ignore
    const actualSpecA = result.runs.find(
      // @ts-ignore
      (run) => run.spec.name === "a.spec.js"
    );

    // const actualSpecA_cached = cachedResult.runs.find(
    //   (run) => run.spec.name === "a.spec.js"
    // );
    // const actualSpecE = result.runs.find(
    //   (run) => run.spec.name === "a.spec.js"
    // );

    expect(actualSpecA).toMatchObject(specA);
    // expect(actualSpecE).toMatchObject(specE);
  });
});
