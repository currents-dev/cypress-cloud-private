import { defineConfig } from "cypress";
import currents from "cypress-cloud/plugin";

module.exports = defineConfig({
  video: true,
  e2e: {
    projectId: !!(process.env.GITHUB_ACTION || process.env.CIRCLE_BRANCH)
      ? "Ij0RfK"
      : "l4zuz8",
    baseUrl: "https://todomvc.com/examples/vanillajs",
    supportFile: "cypress/support/e2e.ts",
    specPattern: ["cypress/e2e/*.js", "cypress/e2e_smoke/*.js"],
    setupNodeEvents(on, config) {
      require("@cypress/grep/src/plugin")(config);
      return currents(on, config);
    },
  },

  component: {
    specPattern: ["pages/__tests__/*.spec.tsx"],
    setupNodeEvents(on, config) {
      return currents(on, config);
    },
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
