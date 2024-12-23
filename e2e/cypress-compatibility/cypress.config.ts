import { defineConfig } from "cypress";
import currents from "cypress-cloud/plugin";

module.exports = defineConfig({
  video: true,
  e2e: {
    baseUrl: "https://todomvc.com/examples/vanillajs",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/*/**/*.spec.js",
    setupNodeEvents(on, config) {
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
