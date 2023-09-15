/// <reference types="Cypress" />
import safeStringify from "fast-safe-stringify";

const afterReportedTests: string[] = [];
const beforeReportedTests: string[] = [];

function sendTestAfterMetrics(test: Mocha.Runnable) {
	if (test.pending || !test.state) {
		// Test is either skipped or hasn't ran yet.
		// We need to check this because all tests will show up in the hook every time
		return;
	}
	// @ts-ignore
	afterReportedTests.push(getTestHash(test));
	cy.task(
		`currents:test:after:run`,
		safeStringify({
			...test,
			fullTitle: test.fullTitle(),
		}),
		{
			log: false,
		}
	);
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
