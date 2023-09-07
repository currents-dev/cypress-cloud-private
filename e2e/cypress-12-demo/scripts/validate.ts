import fs from "fs";

function compareObjectsRecursively(objA: Record<string, any>, objB: Record<string, any>, path = '') {
    let result: { isEqual: boolean, path: string, valueA: any, valueB: any }[] = [];

    if (Array.isArray(objA) && Array.isArray(objB)) {
        for (let i = 0; i < Math.max(objA.length, objB.length); i++) {
            const newPath = `${path}[${i}]`;
            if (i >= objA.length || i >= objB.length || typeof objA[i] !== typeof objB[i]) {
                result.push({
                    path: newPath,
                    valueA: objA[i] || 'Does not exist',
                    valueB: objB[i] || 'Does not exist',
                    isEqual: false
                });
            } else {
                result = result.concat(compareObjectsRecursively(objA[i], objB[i], newPath));
            }
        }
    } else {
        for (let key in objA) {
            const newPath = path ? `${path}.${key}` : key;

            if (objB.hasOwnProperty(key) && typeof objA[key] === 'object' && objA[key] !== null && typeof objB[key] === 'object') {
                result = result.concat(compareObjectsRecursively(objA[key], objB[key], newPath));
            } else {
                if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
                    result.push({
                        path: newPath,
                        valueA: objA[key],
                        valueB: objB.hasOwnProperty(key) ? objB[key] : 'Does not exist',
                        isEqual: false
                    });
                } else {
                    result.push({
                        path: newPath,
                        valueA: objA[key],
                        valueB: objB[key],
                        isEqual: true
                    });
                }
            }
        }

        for (let key in objB) {
            if (!objA.hasOwnProperty(key)) {
                const newPath = path ? `${path}.${key}` : key;
                result.push({
                    path: newPath,
                    valueA: 'Does not exist',
                    valueB: objB[key],
                    isEqual: false
                });
            }
        }
    }

    return result;
}




(async function runValidation() {
    try {
        const originalCurrentApiFile = fs.readFileSync('data-references/original-cypress-12/currents-api-output-reference.json', 'utf8');
        const originalCypressCloudFile = fs.readFileSync('data-references/original-cypress-12/cypress-cloud-output-reference.json', 'utf8');

        const originalCurrentApi = JSON.parse(originalCurrentApiFile);
        const originalCypressCloud = JSON.parse(originalCypressCloudFile);

        const modifiedCurrentApiFile = fs.readFileSync('data-references/modified-cypress-12/currents-api-output-reference.json', 'utf8');
        const modifiedCypressCloudFile = fs.readFileSync('data-references/modified-cypress-12/cypress-cloud-output-reference.json', 'utf8');

        const modifiedCurrentApi = JSON.parse(modifiedCurrentApiFile);
        const modifiedCypressCloud = JSON.parse(modifiedCypressCloudFile);


        const apiComparisonResult = compareObjectsRecursively(originalCurrentApi, modifiedCurrentApi);
        fs.writeFile('validation-results/currents-api-validation.json', JSON.stringify(apiComparisonResult), (err) => {
            if (err) throw err;
            console.log('file saved');
        });

        const packageComparisonResult = compareObjectsRecursively(originalCypressCloud, modifiedCypressCloud);
        fs.writeFile('validation-results/cypress-cloud-validation.json', JSON.stringify(packageComparisonResult), (err) => {
            if (err) throw err;
            console.log('file saved');
        });


    } catch (err) {
        console.error('Process error:', err);
    }
})();
