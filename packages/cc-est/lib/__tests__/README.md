# Data flow test

This test reproduces the data flow as appears in:

https://www.figma.com/file/46bnshkBlyvlmCaCX45Hbx/Cypress-Cloud-Data-Flow?type=whiteboard&node-id=0%3A1&t=OfMHO8NtfI2cUjJw-1

The idea is to replicate the data in the `executionState`.

- Collect the raw events produced by cypress. Search the source code for for `// % save results` comment and uncomment. It will capture raw events and save them. Copy the events to `fixtures`.

  - The raw events are are in `fixtures/<cypressVersion>/<specFile>/<eventType>.json`
  - The expected API response is in `fixtures/api/<specFile>/payload.ts`

- Read the events and populate `executionState`
- Create reporting tasks and compare the output
