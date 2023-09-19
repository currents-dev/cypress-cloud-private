import colors from "colors";

import fs from "fs";
import {
  avoidableApiPropertiesCy13,
  avoidablePropertiesCy13,
  avoidedButNeedePropertiesCy13,
  getApiData,
  runTests,
  runTestsValidation,
} from "../../utils/utils";

colors.enable();

(async function runTest() {
  try {
    const originalCurrentsApiFile = fs.readFileSync(
      "data-references/ccy-1.9.4-cy-12-crapi.json",
      "utf8"
    );
    const originalCypressCloudFile = fs.readFileSync(
      "data-references/ccy-1.9.4-cy-12-cycl.json",
      "utf8"
    );

    const originalCurrentsApi = JSON.parse(originalCurrentsApiFile);
    const originalCypressCloud = JSON.parse(originalCypressCloudFile);

    const cypressCloudData = await runTests(
      "data-references/ccy-1.10-cy-12-cycl.json"
    );
    const currentsApiData = await getApiData(
      cypressCloudData.runUrl,
      "data-references/ccy-1.10-cy-12-crapi.json"
    );

    const modifiedCurrentsApi = currentsApiData;
    const modifiedCypressCloud = cypressCloudData;

    const currentsApiErrors = runTestsValidation(
      originalCurrentsApi,
      modifiedCurrentsApi,
      avoidableApiPropertiesCy13,
      "validation-results/currents-api-validation.json",
      "Starting test: Currents API output",
      "Test Passed: Currents API output is the same in ccy 1.9 cypress 12 without change and ccy 1.10 cypress 12 with changes"
    );

    const cypressCloudErrors = runTestsValidation(
      originalCypressCloud,
      modifiedCypressCloud,
      [...avoidablePropertiesCy13, ...avoidedButNeedePropertiesCy13],
      "validation-results/cypress-cloud-validation.json",
      "Starting test: Cypress Cloud output",
      "Test Passed: Cypress Cloud output is the same in ccy 1.9 cypress 12 without change and ccy 1.10 cypress 12 with changes"
    );

    if (currentsApiErrors.length > 0 || cypressCloudErrors.length > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err: any) {
    console.error("Process error:", err);
    process.exit(1);
  }
})();
