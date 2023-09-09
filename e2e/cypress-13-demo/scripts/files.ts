import assert from "assert";
import { run } from "cypress-cloud";
import fs from "fs";

(async function runTests() {
	const projectId = process.env.CURRENTS_PROJECT_ID || "2cI1I5";
	const recordKey = process.env.CURRENTS_RECORD_KEY || "YakSabgBLb7D40nZ";
	const apiKey =
		process.env.CURRENTS_API_KEY ||
		"YpYIAerb1rWuOFrvf7ciK8Za8koKgrtRfoDPboQUOjScnBv91m4qAXSDb8Rb57m9";
	const apiUrl = "https://api.currents.dev/v1/runs/";

	const ciBuildId = `run-api-smoke-${new Date().toISOString()}`;
	const result: any = await run({
		ciBuildId,
		projectId,
		recordKey,
	});
	assert(result !== undefined);

	const headers = new Headers({
		Authorization: `Bearer ${apiKey}`,
	});

	fs.writeFile(
		"data-references/ccy-1.10-cypress-13/cypress-cloud-output-reference.json",
		JSON.stringify(result),
		(err) => {
			if (err) throw err;
			console.log("file saved");
		}
	);

	const runUrl = result.runUrl;

	fetch(`${apiUrl}${runUrl.split("run/")[1]}`, {
		method: "GET",
		headers,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			console.log(data);
			fs.writeFile(
				"data-references/ccy-1.10-cypress-13/currents-api-output-reference.json",
				JSON.stringify(data),
				(err) => {
					if (err) throw err;
					console.log("file saved");
				}
			);
		})
		.catch((error) => {
			console.error(
				"There was an error in fetch request:",
				error.message
			);
		});
})();
