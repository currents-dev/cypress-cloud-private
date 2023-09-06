/// <reference types="Cypress" />
import safeStringify from "fast-safe-stringify";
localStorage.debug = "cypress:*";

const afterReportedTests: string[] = [];
const beforeReportedTests: string[] = [];

function sendTestAfterMetrics(test: Mocha.Test) {
  if (test.pending || !test.state) {
    // Test is either skipped or hasn't ran yet.
    // We need to check this because all tests will show up in the hook every time
    return;
  }
  afterReportedTests.push(test.fullTitle());
  cy.task(`currents:test:after:run`, safeStringify(test));
}

function sendTestBeforeMetrics(test: Mocha.Test) {
  beforeReportedTests.push(test.fullTitle());
  cy.task(`currents:test:before:run`, safeStringify(test));
}

function sendSuite(suite: Mocha.Suite, eventType: "before" | "after") {
  if(eventType === "after"){
    suite.eachTest((test) => {
      if (!afterReportedTests.includes(test.fullTitle())) {
        sendTestAfterMetrics(test);
      }
    });
  }else if(eventType === "before"){
    suite.eachTest((test) => {
      if (!beforeReportedTests.includes(test.fullTitle())) {
        sendTestBeforeMetrics(test);
      }
    });
  }
}

afterEach(() => {
  // @ts-ignore
  const afterHook = cy.state("runnable");
  if (afterHook.parent) {
    sendSuite(afterHook.parent, "after");
  }
});

beforeEach(() => {
  // @ts-ignore
  const afterHook = cy.state("runnable");
  if (afterHook.parent) {
    sendSuite(afterHook.parent, "before");
  }
})
