import { run } from "cypress-cloud";
import fs from "fs";

(async function runTests() {
	const projectId = process.env.CURRENTS_PROJECT_ID || "projectId";
	const recordKey = process.env.CURRENTS_RECORD_KEY || "recordKey";
	const apiKey = process.env.CURRENTS_API_KEY || "apiKey";
	const apiUrl =
		process.env.CURRENTS_RUN_BASE_URL ||
		"https://api.currents.dev/v1/runs/";

	const ciBuildId = `run-api-smoke-${new Date().toISOString()}`;
	const result: any = await run({
		ciBuildId,
		projectId,
		recordKey,
		batchSize: 4,
	});

	const headers = new Headers({
		Authorization: `Bearer ${apiKey}`,
	});

	fs.writeFile(
		"data-references/ccy-1.10-cypress-12/cypress-cloud-output-reference.json",
		JSON.stringify(result),
		(err) => {
			if (err) throw err;
			console.log("file saved");
		}
	);

	const runUrl = result.runUrl;

	await fetch(`${apiUrl}${runUrl.split("run/")[1]}`, {
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
			fs.writeFile(
				"data-references/ccy-1.10-cypress-12/currents-api-output-reference.json",
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
