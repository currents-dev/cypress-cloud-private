import { run } from "cypress";

(async function main() {
  const result = await run({
    video: true,
    e2e: {
      baseUrl: "https://todomvc.com/examples/vanillajs",
      supportFile: "cypress/support/e2e.ts",
      specPattern: "cypress/e2e/*.js",
    },
  });

  console.log(result);
})();
