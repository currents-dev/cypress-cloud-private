import fs from "fs";

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

  // Si ambos son objetos pero no arrays ni strings
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
  // Si ambos son arrays
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

(async function runValidation() {
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

    const modifiedCurrentApiFile = fs.readFileSync(
      "data-references/ccy-1.10-cypress-12/currents-api-output-reference.json",
      "utf8"
    );
    const modifiedCypressCloudFile = fs.readFileSync(
      "data-references/ccy-1.10-cypress-12/cypress-cloud-output-reference.json",
      "utf8"
    );

    const modifiedCurrentApi = JSON.parse(modifiedCurrentApiFile);
    const modifiedCypressCloud = JSON.parse(modifiedCypressCloudFile);

    const apiComparisonResult = compareObjectsRecursively(
      originalCurrentApi,
      modifiedCurrentApi
    );
    fs.writeFile(
      "validation-results/currents-api-validation.json",
      JSON.stringify(apiComparisonResult),
      (err) => {
        if (err) throw err;
        console.log("file saved");
      }
    );

    const packageComparisonResult = compareObjectsRecursively(
      originalCypressCloud,
      modifiedCypressCloud
    );
    fs.writeFile(
      "validation-results/cypress-cloud-validation.json",
      JSON.stringify(packageComparisonResult),
      (err) => {
        if (err) throw err;
        console.log("file saved");
      }
    );
  } catch (err) {
    console.error("Process error:", err);
  }
})();
