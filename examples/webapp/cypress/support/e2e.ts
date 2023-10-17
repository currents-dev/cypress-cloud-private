import registerCypressGrep from "@cypress/grep/src/support";
require("@currents/cc-est/support");
require("./commands");

registerCypressGrep();
beforeEach(() => {
  cy.visit("/");
});
