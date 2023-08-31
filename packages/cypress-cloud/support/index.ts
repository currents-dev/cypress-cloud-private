/// <reference types="Cypress" />
import safeStringify from "fast-safe-stringify";
localStorage.debug = "cypress:*";

const reportedTests: string[] = [];

function sendTestMetrics(test: Mocha.Test) {
  if (test.pending || !test.state) {
    // Test is either skipped or hasn't ran yet.
    // We need to check this because all tests will show up in the hook every time
    return;
  }
  reportedTests.push(test.fullTitle());
  cy.task("currents:test:after:run", safeStringify(test));
}

function sendSuite(suite: Mocha.Suite) {
  suite.eachTest((test) => {
    if (!reportedTests.includes(test.fullTitle())) {
      sendTestMetrics(test);
    }
  });
}

afterEach(() => {
  // @ts-ignore
  const afterHook = cy.state("runnable");

  if (afterHook.parent) {
    sendSuite(afterHook.parent);
  }
});
