import fs from "fs";
import { expect } from "chai";
import { run } from "cypress-cloud";
import colors from "colors";
colors.enable();

export const avoidablePropertiesCy13: AvoidableProperty[] = [
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
	{
		property: "specFileExtension",
		mustHave: false,
	},
	{
		property: "relativeToCommonRoot",
		mustHave: false,
	},
	{
		property: "specType",
		mustHave: false,
	},
	{
		property: "cypressBinaryRoot",
		mustHave: false,
	},
	{
		property: "env.currents_temp_file",
		mustHave: false,
	},
	{
		property: "resolved.nodeVersion",
		mustHave: false,
	},
	{
		property: "config.version",
		mustHave: true,
	},
	{
		property: "config.browsers[1].version",
		mustHave: true,
	},
	{
		property: "config.resolved.browsers.value[1].version",
		mustHave: true,
	},
];

export const avoidableApiPropertiesCy13: AvoidableProperty[] = [
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
		property: "data.cypressVersion",
		mustHave: true,
	},
	{
		property: "data.meta.commit.authorEmail",
		mustHave: true,
	},
	{
		property: "data.meta.commit.authorName",
		mustHave: true,
	},
	{
		property: "data.meta.commit.message",
		mustHave: true,
	},
	{
		property: "data.meta.commit.sha",
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
];

export const avoidedButNeedePropertiesCy13: AvoidableProperty[] = [
	{
		property: "resolved.video.value",
		mustHave: false,
	},
	{
		property: "resolved.videoCompression.value",
		mustHave: false,
	},
	{
		property: "config.resolved.videoUploadOnPasses",
		mustHave: false,
	},
	{
		property: /runs\[\d+\]\.video/,
		mustHave: true,
		isRegex: true,
	},
	{
		property: /runs\[\d+\]\.hooks/,
		mustHave: true,
		isRegex: true,
	},
	{
		property: /runs\[\d+\]\.tests\[\d+\]\.body/,
		mustHave: true,
		isRegex: true,
	},
	{
		property:
			/runs\[\d+\]\.tests\[\d+\]\.attempts\[\d+\]\.timings\.after each\[1\]/,
		mustHave: true,
		isRegex: true,
	},
	{
		property:
			/runs\[\d+\]\.tests\[\d+\]\.attempts\[\d+\]\.timings\.after all/,
		mustHave: true,
		isRegex: true,
	},
	{
		property: "config.video",
		mustHave: true,
	},
	{
		property: "config.videoCompression",
		mustHave: true,
	},
	{
		property: "config.videoUploadOnPasses",
		mustHave: true,
	},
	{
		property: "runs[2].tests[0].attempts[0]",
		mustHave: true,
	},
	{
		property: "runs[2].tests[0].testId",
		mustHave: true,
	},
];

export type ComparisonResult = {
	path: string;
	valueA: any;
	valueB: any;
	isEqual: boolean;
	note?: string;
};

export type AvoidableProperty = {
	property: string | RegExp;
	mustHave: boolean;
	isRegex?: boolean;
};

export const similarPropertiesCy13: {
	property: string;
	similarProperty: string;
}[] = [
	{
		property: "spec.baseName",
		similarProperty: "spec.name",
	},
	{
		property: "spec.name",
		similarProperty: "spec.relative",
	},
];

export function compareObjectsRecursively(
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
				? "Does not exist"
				: objB === undefined
				? "Does not exist"
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

export async function getApiData(runUrl: string, filePath: string) {
	const { apiKey, apiUrl } = getCurrentsTestsVariables();
	const headers = new Headers({
		Authorization: `Bearer ${apiKey}`,
	});

	try {
		const response = await fetch(`${apiUrl}${runUrl.split("run/")[1]}`, {
			method: "GET",
			headers,
		});
		const result = await response.json();

		writeFile(filePath, result);

		return result;
	} catch (e: any) {
		throw new Error(e.toString());
	}
}

export function isAvoidableProperty(
	property: string,
	avoidableProperties: AvoidableProperty[]
): AvoidableProperty | undefined {
	const avoidableData = avoidableProperties.find((item) => {
		if (item.isRegex) {
			return (item.property as RegExp).test(property);
		}

		return property.includes(item.property as string);
	});
	if (avoidableData) {
		return avoidableData;
	}
	return;
}

export function isSimilarProperty(propertyA: string) {
	const similarData = similarPropertiesCy13.find((item) =>
		propertyA.includes(item.property)
	);
	if (similarData) {
		return similarData;
	}
	return;
}

export function testEachResults(
	results: ComparisonResult[],
	avoidableProperties: AvoidableProperty[]
): string[] {
	const errors: string[] = [];
	results.forEach((result) => {
		try {
			if (result.valueA) {
				const avoidableData = isAvoidableProperty(
					result.path,
					avoidableProperties
				);

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
					expect(
						result.valueB,
						`The values at ${
							result.path
						} does not exist and it should. ${result.note ?? ""}`
					).not.to.equal("undefined");
					return;
				}
			}
		} catch (e: any) {
			const error = `${errors.length}.- ${e.toString()}`;
			errors.push(error);
			console.log(error.red);
		}
	});
	return errors;
}

export function getCurrentsTestsVariables() {
	const projectId = process.env.CURRENTS_PROJECT_ID || "2cI1I5";
	const recordKey = process.env.CURRENTS_RECORD_KEY || "YakSabgBLb7D40nZ";
	const ciBuildId = `run-compat-test-${new Date().toISOString()}`;
	const apiKey =
		process.env.CURRENTS_API_KEY ||
		"YpYIAerb1rWuOFrvf7ciK8Za8koKgrtRfoDPboQUOjScnBv91m4qAXSDb8Rb57m9";
	const apiUrl =
		process.env.CURRENTS_RUN_BASE_URL ||
		"https://api.currents.dev/v1/runs/";
	return {
		projectId,
		recordKey,
		ciBuildId,
		apiKey,
		apiUrl,
	};
}

export function writeFile(path: string, data: any) {
	try {
		fs.writeFileSync(path, JSON.stringify(data));
		console.log("FILE SAVED");
	} catch (e) {
		console.error("FILE SAVE ERROR::", e);
		throw e;
	}
}

export function runTestsValidation(
	originalData: any,
	modifiedData: any,
	avoidableProperties: AvoidableProperty[],
	filePath: string,
	startMessage: string,
	successMessage: string
) {
	console.log(startMessage.yellow);

	const results = compareObjectsRecursively(originalData, modifiedData);

	writeFile(filePath, results);

	const errors = testEachResults(results, avoidableProperties);

	if (errors.length === 0) {
		console.log(successMessage.green);
	}

	return errors;
}

export async function runTests(filePath: string) {
	const { projectId, recordKey, ciBuildId } = getCurrentsTestsVariables();
	const result: any = await run({
		ciBuildId,
		projectId,
		recordKey,
		batchSize: 4,
	});

	writeFile(filePath, result);

	return result;
}
