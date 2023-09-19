import { getApiData, runTests } from "../../utils/utils";

(async function runFiles() {
  const cypressCloudData = await runTests(
    "data-references/ccy-1.9.4-cy-12-cycl.json"
  );

  await getApiData(
    cypressCloudData.runUrl,
    "data-references/ccy-1.9.4-cy-12-crapi.json"
  );
})();
