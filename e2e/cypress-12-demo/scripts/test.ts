import fs from "fs";
import { expect } from "chai";
import { run } from "cypress-cloud";
import colors from "colors";
colors.enable();

type ComparisonResult = {
	path: string;
	valueA: any;
	valueB: any;
	isEqual: boolean;
	note?: string;
};

function compareObjectsRecursively(
	objA: any,
	objB: any,
	path: string = ""
): ComparisonResult[] {
	let results: ComparisonResult[] = [];

	// If both are objects but neither arrays nor strings.
	if (
		typeof objA === "object" &&
		objA !== null &&
		!(objA instanceof Array) &&
		typeof objA !== "string" &&
		typeof objB === "object" &&
		objB !== null &&
		!(objB instanceof Array) &&
		typeof objB !== "string"
	) {
		const keys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

		keys.forEach((key) => {
			const newPath = path ? `${path}.${key}` : key;
			results = results.concat(
				compareObjectsRecursively(objA[key], objB[key], newPath)
			);
		});
	}
	// If both are arrays
	else if (Array.isArray(objA) && Array.isArray(objB)) {
		const maxLength = Math.max(objA.length, objB.length);
		for (let i = 0; i < maxLength; i++) {
			const newPath = `${path}[${i}]`;
			results = results.concat(
				compareObjectsRecursively(objA[i], objB[i], newPath)
			);
		}
	} else {
		const isEqual = objA === objB;
		const note =
			objA === undefined
				? "Does not exist in A"
				: objB === undefined
				? "Does not exist in B"
				: undefined;

		results.push({
			path: path || "root",
			valueA: objA,
			valueB: objB,
			isEqual: isEqual,
			note: note,
		});
	}

	return results;
}

const avoidableProperties: { property: string; mustHave: boolean }[] = [
	{
		property: "runId",
		mustHave: true,
	},
	{
		property: "createdAt",
		mustHave: true,
	},
	{
		property: "groupId",
		mustHave: true,
	},
	{
		property: "createdAt",
		mustHave: true,
	},
	{
		property: "ciBuildId",
		mustHave: true,
	},
	{
		property: "instanceId",
		mustHave: true,
	},
	{
		property: "claimedAt",
		mustHave: true,
	},
	{
		property: "completedAt",
		mustHave: true,
	},
	{
		property: "machineId",
		mustHave: true,
	},
	{
		property: "videoUrl",
		mustHave: true,
	},
	{
		property: "duration",
		mustHave: true,
	},
	{
		property: "endedAt",
		mustHave: true,
	},
	{
		property: "startedAt",
		mustHave: true,
	},
	{
		property: "wallClockDuration",
		mustHave: true,
	},
	{
		property: "wallClockStartedAt",
		mustHave: true,
	},
	{
		property: "wallClockEndedAt",
		mustHave: true,
	},
	{
		property: "screenshotId",
		mustHave: true,
	},
	{
		property: "takenAt",
		mustHave: true,
	},
	{
		property: "screenshotURL",
		mustHave: true,
	},
	{
		property: "size",
		mustHave: false,
	},
	{
		property: "dimensions",
		mustHave: false,
	},
	{
		property: "multipart",
		mustHave: false,
	},
	{
		property: "specName",
		mustHave: false,
	},
	{
		property: "testFailure",
		mustHave: false,
	},
	{
		property: "scaled",
		mustHave: false,
	},
	{
		property: "blackout",
		mustHave: false,
	},
	{
		property: "blackout",
		mustHave: false,
	},
	{
		property: "totalDuration",
		mustHave: true,
	},
	{
		property: "start",
		mustHave: true,
	},
	{
		property: "end",
		mustHave: true,
	},
	{
		property: "error.message",
		mustHave: true,
	},
	{
		property: "error.stack",
		mustHave: true,
	},
	{
		property: "lifecycle",
		mustHave: true,
	},
	{
		property: "fnDuration",
		mustHave: true,
	},
	{
		property: "afterFnDuration",
		mustHave: true,
	},
	{
		property: "videoTimestamp",
		mustHave: true,
	},
	{
		property: "config.resolved.env.currents_temp_file.value",
		mustHave: true,
	},
	{
		property: "socketId",
		mustHave: true,
	},
	{
		property: "runUrl",
		mustHave: true,
	},
	{
		property: "commit.message",
		mustHave: true,
	},
	{
		property: "commit.sha",
		mustHave: true,
	},
	{
		property: "cypressVersion",
		mustHave: true,
	},
];

function isAvoidableProperty(property: string) {
	const avoidableData = avoidableProperties.find((item) =>
		property.includes(item.property)
	);
	if (avoidableData) {
		return avoidableData;
	}
	return;
}

function testEachResults(results: ComparisonResult[]) {
	results.forEach((result) => {
		if (result.valueA) {
			const avoidableData = isAvoidableProperty(result.path);
			if (!avoidableData) {
				expect(
					result.valueA,
					`The values are not equal at: ${result.path}. ${
						result.note ?? ""
					}`
				).to.equal(result.valueB);
				return;
			}

			if (avoidableData.mustHave) {
				expect(
					result.valueB,
					`The values at ${
						result.path
					} does not exist and it should. ${result.note ?? ""}`
				).not.to.equal("Does not exist");
				return;
			}
		}
	});
}

async function runTests() {
	const projectId = process.env.CURRENTS_PROJECT_ID || "2cI1I5";
	const recordKey = process.env.CURRENTS_RECORD_KEY || "YakSabgBLb7D40nZ";

	const ciBuildId = `run-api-smoke-${new Date().toISOString()}`;
	const result: any = await run({
		ciBuildId,
		projectId,
		recordKey,
		batchSize: 4,
	});

	return result;
}

async function getApiData(runUrl: string) {
	const apiKey =
		process.env.CURRENTS_API_KEY ||
		"YpYIAerb1rWuOFrvf7ciK8Za8koKgrtRfoDPboQUOjScnBv91m4qAXSDb8Rb57m9";
	const apiUrl = "https://api.currents.dev/v1/runs/";

	const headers = new Headers({
		Authorization: `Bearer ${apiKey}`,
	});

	try {
		const response = await fetch(`${apiUrl}${runUrl.split("run/")[1]}`, {
			method: "GET",
			headers,
		});
		const result = await response.json();

		return result;
	} catch (e: any) {
		throw new Error(e.toString());
	}
}

(async function runTest() {
	try {
		const originalCurrentApiFile = fs.readFileSync(
			"data-references/ccy-1.9.4-cypress-12/currents-api-output-reference.json",
			"utf8"
		);
		const originalCypressCloudFile = fs.readFileSync(
			"data-references/ccy-1.9.4-cypress-12/cypress-cloud-output-reference.json",
			"utf8"
		);

		const originalCurrentApi = JSON.parse(originalCurrentApiFile);
		const originalCypressCloud = JSON.parse(originalCypressCloudFile);

		const cypressCloudData = await runTests();
		const currentsApiData = await getApiData(cypressCloudData.runUrl);

		const modifiedCurrentApi = currentsApiData;
		const modifiedCypressCloud = cypressCloudData;

		const currentsApiResults = compareObjectsRecursively(
			originalCurrentApi,
			modifiedCurrentApi
		);

		console.log("Starting test: Currents API output".yellow);

		testEachResults(currentsApiResults);

		console.log(
			"Test Passed: Currents API output is the same in ccy 1.9 cypress 12 without change and ccy 1.9 cypress 12 with changes"
				.green
		);

		console.log("Starting test: Cypress Cloud output".yellow);

		const cypressCloudResults = compareObjectsRecursively(
			originalCypressCloud,
			modifiedCypressCloud
		);

		testEachResults(cypressCloudResults);

		console.log(
			"Test Passed: Cypress Cloud output is the same in ccy 1.9 cypress 12 without change and ccy 1.9 cypress 12 with changes"
				.green
		);
	} catch (err) {
		console.error("Process error:", err);
	}
})();
