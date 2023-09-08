import fs from "fs";
import { expect } from 'chai';

type ComparisonResult = {
    path: string;
    valueA: any;
    valueB: any;
    isEqual: boolean;
    note?: string;
};

function compareObjectsRecursively(objA: any, objB: any, path: string = ''): ComparisonResult[] {
    let results: ComparisonResult[] = [];

    // If both are objects but neither arrays nor strings.
    if (typeof objA === 'object' && objA !== null && !(objA instanceof Array) && typeof objA !== 'string' &&
        typeof objB === 'object' && objB !== null && !(objB instanceof Array) && typeof objB !== 'string') {

        const keys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

        keys.forEach(key => {
            const newPath = path ? `${path}.${key}` : key;
            results = results.concat(compareObjectsRecursively(objA[key], objB[key], newPath));
        });
    }
    // If both are arrays
    else if (Array.isArray(objA) && Array.isArray(objB)) {
        const maxLength = Math.max(objA.length, objB.length);
        for (let i = 0; i < maxLength; i++) {
            const newPath = `${path}[${i}]`;
            results = results.concat(compareObjectsRecursively(objA[i], objB[i], newPath));
        }
    }
    else {
        const isEqual = objA === objB;
        const note = objA === undefined ? "Does not exist in A" : objB === undefined ? "Does not exist in B" : undefined;

        results.push({
            path: path || 'root',
            valueA: objA,
            valueB: objB,
            isEqual: isEqual,
            note: note
        });
    }

    return results;
}

const avoidableProperties: { property: string, mustHave: boolean }[] = [
    {
        property: "runId",
        mustHave: true
    },
    {
        property: "createdAt",
        mustHave: true
    },
    {
        property: "groupId",
        mustHave: true
    },
    {
        property: "createdAt",
        mustHave: true
    },
    {
        property: "ciBuildId",
        mustHave: true
    },
    {
        property: "instanceId",
        mustHave: true
    },
    {
        property: "claimedAt",
        mustHave: true
    },
    {
        property: "completedAt",
        mustHave: true
    },
    {
        property: "machineId",
        mustHave: true
    },
    {
        property: "videoUrl",
        mustHave: true
    },
    {
        property: "duration",
        mustHave: true
    },
    {
        property: "endedAt",
        mustHave: true
    },
    {
        property: "startedAt",
        mustHave: true
    },
    {
        property: "wallClockDuration",
        mustHave: true
    },
    {
        property: "wallClockStartedAt",
        mustHave: true
    },
    {
        property: "wallClockEndedAt",
        mustHave: true
    },
    {
        property: "screenshotId",
        mustHave: true
    },
    {
        property: "takenAt",
        mustHave: true
    },
    {
        property: "screenshotURL",
        mustHave: true
    },
    {
        property: "size",
        mustHave: false
    },
    {
        property: "dimensions",
        mustHave: false
    },
    {
        property: "multipart",
        mustHave: false
    },
    {
        property: "specName",
        mustHave: false
    },
    {
        property: "testFailure",
        mustHave: false
    },
    {
        property: "scaled",
        mustHave: false
    },
    {
        property: "blackout",
        mustHave: false
    },
    {
        property: "blackout",
        mustHave: false
    },
    {
        property: "totalDuration",
        mustHave: true
    },
    {
        property: "start",
        mustHave: true
    },
    {
        property: "end",
        mustHave: true
    },
    {
        property: "error.message",
        mustHave: true
    },
    {
        property: "error.stack",
        mustHave: true
    },
    {
        property: "lifecycle",
        mustHave: true
    },
    {
        property: "fnDuration",
        mustHave: true
    },
    {
        property: "afterFnDuration",
        mustHave: true
    },
    {
        property: "videoTimestamp",
        mustHave: true
    },
    {
        property: "config.resolved.env.currents_temp_file.value",
        mustHave: true
    },
    {
        property: "socketId",
        mustHave: true
    },
    {
        property: "runUrl",
        mustHave: true
    }
];

function isAvoidableProperty(property: string) {
    const avoidableData = avoidableProperties.find(item => property.includes(item.property));
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
                expect(result.valueA, `The values are not equal at: ${result.path}. ${result.note ?? ""}`).to.equal(result.valueB);
                return;
            }

            if (avoidableData.mustHave) {
                expect(result.valueB, `The values at ${result.path} does not exist and it should. ${result.note ?? ""}`).not.to.equal("Does not exist");
                return;
            }
        }
    })
}



(async function runTest() {
    try {
        const originalCurrentApiFile = fs.readFileSync('data-references/ccy-1.9.4-cypress-12/currents-api-output-reference.json', 'utf8');
        const originalCypressCloudFile = fs.readFileSync('data-references/ccy-1.9.4-cypress-12/cypress-cloud-output-reference.json', 'utf8');

        const originalCurrentApi = JSON.parse(originalCurrentApiFile);
        const originalCypressCloud = JSON.parse(originalCypressCloudFile);

        const modifiedCurrentApiFile = fs.readFileSync('data-references/ccy-1.10-cypress-12/currents-api-output-reference.json', 'utf8');
        const modifiedCypressCloudFile = fs.readFileSync('data-references/ccy-1.10-cypress-12/cypress-cloud-output-reference.json', 'utf8');

        const modifiedCurrentApi = JSON.parse(modifiedCurrentApiFile);
        const modifiedCypressCloud = JSON.parse(modifiedCypressCloudFile);


        const currentsApiResults = compareObjectsRecursively(originalCurrentApi, modifiedCurrentApi);

        testEachResults(currentsApiResults);

        const cypressCloudResults = compareObjectsRecursively(originalCypressCloud, modifiedCypressCloud);

        testEachResults(cypressCloudResults);


    } catch (err) {
        console.error('Process error:', err);
    }
})();
