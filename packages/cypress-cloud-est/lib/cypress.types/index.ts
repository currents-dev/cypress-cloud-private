import { Cypress12 } from "./12";
import { Cypress13 } from "./13";

export * from "./12";
export * from "./13";
export * from "./shared";
export namespace CypressTypes {
  export namespace EventPayload {
    export type ScreenshotAfter =
      | Cypress12.ScreenshotAfter.Payload
      | Cypress13.ScreenshotAfter.Payload;

    export type TestAfter =
      | Cypress12.TestAfter.Payload
      | Cypress13.TestAfter.Payload;

    export type TestBefore =
      | Cypress12.TestBefore.Payload
      | Cypress13.TestBefore.Payload;

    export namespace SpecAfter {
      export type Spec = Cypress12.SpecAfter.Spec | Cypress13.SpecAfter.Spec;
      export type Stats = Cypress12.SpecAfter.Stats | Cypress13.SpecAfter.Stats;
      export type Test = Cypress12.SpecAfter.Test | Cypress13.SpecAfter.Test;
      export type TestAttempt =
        | Cypress12.SpecAfter.TestAttempt
        | Cypress13.SpecAfter.TestAttempt;

      export type Payload =
        | Cypress12.SpecAfter.Payload
        | Cypress13.SpecAfter.Payload;
    }
  }

  export namespace ModuleAPI {
    export type Result =
      | Cypress12.ModuleAPI.Result
      | Cypress13.ModuleAPI.Result;

    export type FailureResult =
      | Cypress12.ModuleAPI.FailureResult
      | Cypress13.ModuleAPI.FailureResult;

    export type CompletedResult =
      | Cypress12.ModuleAPI.CompletedResult
      | Cypress13.ModuleAPI.CompletedResult;

    export type Run = Cypress12.ModuleAPI.Run | Cypress13.ModuleAPI.Run;

    export type Test = Cypress12.ModuleAPI.Test | Cypress13.ModuleAPI.Test;
    export type TestAttempt =
      | Cypress12.ModuleAPI.TestAttempt
      | Cypress13.ModuleAPI.TestAttempt;
  }
}

/**
 *  How Currents stores data internally and how we send it to the backend
 */
export namespace Standard {
  /**
   * spef:after event
   */
  export namespace SpecAfter {
    /**
     * spec:after event payload
     */
    export type Payload = Cypress12.SpecAfter.Payload;
    export type Spec = Cypress12.SpecAfter.Spec;
    export type Stats = Cypress12.SpecAfter.Stats;
    export type Test = Cypress12.SpecAfter.Test;
    export type TestAttempt = Cypress12.SpecAfter.TestAttempt;
  }

  /**
   * Module API (cypress.run())
   */
  export namespace ModuleAPI {
    /**
     * return value of cypress.run()
     */
    export type Result = Cypress12.ModuleAPI.Result;
    export type CompletedResult = Cypress12.ModuleAPI.CompletedResult;
    export type Run = Cypress12.ModuleAPI.Run;
    export type Test = Cypress12.ModuleAPI.Test;
    export type TestAttempt = Cypress12.ModuleAPI.TestAttempt;
  }
}
