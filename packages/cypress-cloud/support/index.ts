/// <reference types="Cypress" />
import safeStringify from "fast-safe-stringify";

const afterReportedTests: string[] = [];
const beforeReportedTests: string[] = [];

function pickTestData(test: Mocha.Runnable) {
  return {
    async: test.async,
    body: test.body,
    duration: test.duration,
    // @ts-ignore
    err: test.err,
    // @ts-ignore
    final: test.final,
    // @ts-ignore
    hooks: test.hooks,
    // @ts-ignore
    id: test.id,
    // @ts-ignore
    invocationDetails: test.invocationDetails,
    // @ts-ignore
    order: test.order,
    pending: test.pending,
    retries: test.retries(),
    state: test.state,
    sync: test.sync,
    timedOut: test.timedOut,
    // @ts-ignore
    timings: test.timings,
    // @ts-ignore
    type: test.type,
    // @ts-ignore
    wallClockStartedAt: test.wallClockStartedAt,
    title: test.title,
    // @ts-ignore
    currentRetry: test._currentRetry,
    fullTitle: test.fullTitle(),
  };
}
function sendTestAfterMetrics(test: Mocha.Runnable) {
  if (test.pending || !test.state) {
    // Test is either skipped or hasn't ran yet.
    // We need to check this because all tests will show up in the hook every time
    return;
  }
  // @ts-ignore
  afterReportedTests.push(getTestHash(test));
  cy.task(`currents:test:after:run`, safeStringify(pickTestData(test)), {
    log: false,
  });
}

function sendTestBeforeMetrics(test: Mocha.Runnable) {
  beforeReportedTests.push(getTestHash(test));
  cy.task(`currents:test:before:run`, safeStringify(test), {
    log: false,
  });
}

function getTestHash(test: Mocha.Runnable) {
  // @ts-ignore
  return `${test.fullTitle()}-${test._currentRetry}`;
}

function handleAfter(test: Mocha.Runnable) {
  if (!afterReportedTests.includes(getTestHash(test))) {
    sendTestAfterMetrics(test);
  }
}
function handleBefore(test: Mocha.Runnable) {
  if (!beforeReportedTests.includes(getTestHash(test))) {
    sendTestBeforeMetrics(test);
  }
}

afterEach(() => {
  // @ts-ignore
  const currentTest = cy.state("ctx").currentTest;
  if (currentTest) {
    handleAfter(currentTest);
  }
});

beforeEach(() => {
  // @ts-ignore
  const currentTest = cy.state("ctx").currentTest;

  if (currentTest) {
    handleBefore(currentTest);
  }
});
