# Cypress Types

This directory stored cross-version definition of Cypress Types. Those definition help to identify and standardize the results across different versions.

- `13.ts` - data for Cypress 13+ (based on 13.2.0)
- `12.ts` - data for Cypress 12+ (based on 12.174)
- `index.ts` - union of all types

The namespaces in `index.ts` are as follows:

- `CypressTypes` - Cypress types

  - `EventPayload` - data for different event emitted by Cypress
  - `ModuleAPI` - data returned by `cypress.run` ModuleAPI

- `Standard` - a standard form used by Currents to store data collected from various cypress versions. Before sending payload to Currents or Sorry Cypress API we will convert the data from version-specific shape to the `Standard` shape via a series of transformations (see `dataFlow.spec.ts`)

  - `SpecAfter` - payload of `spec:after` events
  - `ModuleAPI` - payload of `cypress.run` return value
