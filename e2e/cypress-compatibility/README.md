# E2E Compatibility Tests

## CI

See GH workflow YAML file

## Run Locally

Install the desired cypress version localy in `packages/cypress-cloud` directory

```sh
CURRENTS_API_BASE_URL=https://api.currents.dev/v1 \
CURRENTS_API_KEY=<api_key>  \
CURRENTS_RECORD_KEY=<key> \
CURRENTS_PROJECT_ID=<project> \
CURRENTS_USE_CYPRESS_VERSION=<12|13...> \
npx jest --watch
```
