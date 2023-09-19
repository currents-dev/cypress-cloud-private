import { expect } from "@jest/globals";

const getScreenshot = ({
  name,
  testId,
  testAttemptIndex,
}: {
  name: string | null;
  testId: string;
  testAttemptIndex: number;
}) => ({
  screenshotId: expect.any(String),
  name,
  testId: testId,
  testAttemptIndex,
  takenAt: expect.any(String),
  path: expect.any(String),
  height: expect.any(Number),
  width: expect.any(Number),
});

export const specA = {
  stats: {
    duration: expect.any(Number),
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 1,
    passes: 0,
    pending: 0,
    skipped: 0,
    suites: 1,
    tests: 1,
  },
  reporter: "spec",
  reporterStats: {
    suites: 1,
    tests: 1,
    passes: 0,
    pending: 0,
    failures: 1,
    start: expect.any(String),
    end: expect.any(String),
    duration: expect.any(Number),
  },
  spec: {
    // baseName: "a.spec.js",
    // specFileExtension: ".spec.js",
    // relativeToCommonRoot: "a.spec.js",
    // specType: "integration",
    fileExtension: ".js",
    fileName: "a",
    name: "a.spec.js",
    relative: "cypress/e2e/a.spec.js",
    absolute: expect.stringMatching("a.spec.js"),
  },
  error: null,
  video: expect.any(String),
  shouldUploadVideo: true,
  hooks: null,
  tests: [
    {
      testId: "r3",
      title: ["Failing test with 2 attempts", "should try 2 times"],
      state: "failed",
      body: "() => {\n    cy.wrap(false).should('be.true');\n  }",
      displayError:
        "AssertionError: Timed out retrying after 4000ms: expected false to be true\n    at Context.eval (webpack://cypress-13-demo/./cypress/e2e/a.spec.js:5:19)",
      attempts: [
        {
          state: "failed",
          error: {
            name: "AssertionError",
            message:
              "Timed out retrying after 4000ms: expected false to be true",
            stack: expect.any(String),
            codeFrame: {
              line: 5,
              column: 20,
              originalFile: "cypress/e2e/a.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/a.spec.js",
              absoluteFile: expect.stringContaining("a.spec.js"),
              frame:
                "  3 |     retries: 2,\n  4 |   }, () => {\n> 5 |     cy.wrap(false).should('be.true');\n    |                    ^\n  6 |   });\n  7 | });\n  8 | ",
              language: "js",
            },
          },
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            {
              screenshotId: expect.any(String),
              name: null,
              testId: "r3",
              testAttemptIndex: 0,
              takenAt: expect.any(String),
              path: expect.any(String),
              height: expect.any(Number),
              width: expect.any(Number),
            },
          ],
        },
        {
          state: "failed",
          error: {
            name: "AssertionError",
            message:
              "Timed out retrying after 4000ms: expected false to be true",
            stack: expect.any(String),
            codeFrame: {
              line: 5,
              column: 20,
              originalFile: "cypress/e2e/a.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/a.spec.js",
              absoluteFile: expect.stringContaining("a.spec.js"),
              frame:
                "  3 |     retries: 2,\n  4 |   }, () => {\n> 5 |     cy.wrap(false).should('be.true');\n    |                    ^\n  6 |   });\n  7 | });\n  8 | ",
              language: "js",
            },
          },
          timings: expect.anything(),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            {
              screenshotId: expect.any(String),
              name: null,
              testId: "r3",
              testAttemptIndex: 1,
              takenAt: expect.any(String),
              path: expect.any(String),
              height: expect.any(Number),
              width: expect.any(Number),
            },
          ],
        },
        {
          state: "failed",
          error: {
            name: "AssertionError",
            message:
              "Timed out retrying after 4000ms: expected false to be true",
            stack: expect.any(String),
            codeFrame: {
              line: 5,
              column: 20,
              originalFile: "cypress/e2e/a.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/a.spec.js",
              absoluteFile: expect.stringContaining("a.spec.js"),
              frame:
                "  3 |     retries: 2,\n  4 |   }, () => {\n> 5 |     cy.wrap(false).should('be.true');\n    |                    ^\n  6 |   });\n  7 | });\n  8 | ",
              language: "js",
            },
          },
          timings: expect.anything(),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            {
              screenshotId: expect.any(String),
              name: null,
              testId: "r3",
              testAttemptIndex: 2,
              takenAt: expect.any(String),
              path: expect.any(String),
              height: expect.any(Number),
              width: expect.any(Number),
            },
          ],
        },
      ],
    },
  ],
};
export const specE = {
  stats: {
    duration: expect.any(Number),
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 1,
    passes: 0,
    pending: 0,
    skipped: 0,
    suites: 1,
    tests: 1,
  },
  reporter: "spec",
  reporterStats: {
    suites: 1,
    tests: 1,
    passes: 0,
    pending: 0,
    failures: 1,
    start: expect.any(String),
    end: expect.any(String),
    duration: expect.any(Number),
  },
  spec: {
    // baseName: "e.spec.js",
    // specFileExtension: ".spec.js",
    // relativeToCommonRoot: "e.spec.js",
    // specType: "integration",
    fileExtension: ".js",
    fileName: "e",
    name: "e.spec.js",
    relative: "cypress/e2e/e.spec.js",
    absolute: expect.stringMatching("e.spec.js"),
  },
  error: null,
  video: expect.any(String),
  shouldUploadVideo: true,
  hooks: null,
  tests: [
    {
      testId: "r3",
      title: ["Should throw an error", "Should throw an error"],
      state: "failed",
      body: '() => {\n    throw new Error("test error");\n  }',
      displayError:
        "Error: test error\n    at Context.eval (webpack://cypress-13-demo/./cypress/e2e/e.spec.js:3:10)",
      attempts: [
        {
          state: "failed",
          error: {
            name: "Error",
            message: "test error",
            stack: expect.any(String),
            codeFrame: {
              line: 3,
              column: 11,
              originalFile: "cypress/e2e/e.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/e.spec.js",
              absoluteFile: expect.stringContaining("e.spec.js"),
              frame:
                "  1 | describe('Should throw an error', () => {\n  2 |   it('Should throw an error', () => {\n> 3 |     throw new Error(\"test error\")\n    |           ^\n  4 |   });\n  5 | });\n  6 | ",
              language: "js",
            },
          },
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            {
              screenshotId: expect.any(String),
              name: null,
              testId: "r3",
              testAttemptIndex: 0,
              takenAt: expect.any(String),
              path: expect.any(String),
              height: expect.any(Number),
              width: expect.any(Number),
            },
          ],
        },
      ],
    },
  ],
};
export const specD = {
  stats: {
    duration: expect.any(Number),
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 0,
    passes: 2,
    pending: 0,
    skipped: 0,
    suites: 1,
    tests: 2,
  },
  reporter: "spec",
  reporterStats: {
    suites: 1,
    tests: 2,
    passes: 2,
    pending: 0,
    failures: 0,
    start: expect.any(String),
    end: expect.any(String),
    duration: expect.any(Number),
  },
  spec: {
    // baseName: "d.spec.js",
    // specFileExtension: ".spec.js",
    // relativeToCommonRoot: "d.spec.js",
    // specType: "integration",
    fileExtension: ".js",
    fileName: "d",
    name: "d.spec.js",
    relative: "cypress/e2e/d.spec.js",
    absolute: expect.stringMatching("d.spec.js"),
  },
  error: null,
  video: expect.any(String),
  shouldUploadVideo: true,
  hooks: null,
  tests: [
    {
      testId: "r3",
      title: [
        "Passed test with screenshot, passed test with no screenshots",
        "should assert and take a screenshot",
      ],
      state: "passed",
      body: "() => {\n    // Assert that true is true\n    cy.wrap(true).should('be.true');\n\n    // Take a screenshot\n    cy.screenshot('internal-assert-screenshot');\n  }",
      displayError: null,
      attempts: [
        {
          state: "passed",
          error: null,
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            {
              screenshotId: expect.any(String),
              name: "internal-assert-screenshot",
              testId: "r3",
              testAttemptIndex: 0,
              takenAt: expect.any(String),
              path: expect.any(String),
              height: expect.any(Number),
              width: expect.any(Number),
            },
          ],
        },
      ],
    },
    {
      testId: "r4",
      title: [
        "Passed test with screenshot, passed test with no screenshots",
        "should assert that true is true",
      ],
      state: "passed",
      body: "() => {\n    cy.wrap(true).should('be.true');\n  }",
      displayError: null,
      attempts: [
        {
          state: "passed",
          error: null,
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [],
        },
      ],
    },
  ],
};
export const specC = {
  stats: {
    duration: expect.any(Number),
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 0,
    passes: 0,
    pending: 1,
    skipped: 0,
    suites: 1,
    tests: 1,
  },
  reporter: "spec",
  reporterStats: {
    suites: 1,
    tests: 1,
    passes: 0,
    pending: 1,
    failures: 0,
    start: expect.any(String),
    end: expect.any(String),
    duration: expect.any(Number),
  },
  spec: {
    // baseName: "c.spec.js",
    // specFileExtension: ".spec.js",
    // relativeToCommonRoot: "c.spec.js",
    // specType: "integration",
    fileExtension: ".js",
    fileName: "c",
    name: "c.spec.js",
    relative: "cypress/e2e/c.spec.js",
    absolute: expect.stringMatching("c.spec.js"),
  },
  error: null,
  video: expect.any(String),
  shouldUploadVideo: true,
  hooks: null,
  tests: [
    {
      // pending test do not emit "beforeEach" so we can't get the details for cy13
      testId: expect.stringMatching(/r\d{1,2}/),
      title: ["Ignored test", "should be a skipped test"],
      state: "pending",
      // pending test do not emit "beforeEach" so we can't get the details for cy13
      body: expect.any(String),
      displayError: null,
      attempts: [
        {
          state: "pending",
          error: null,
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [],
        },
      ],
    },
  ],
};
export const specB = {
  stats: {
    duration: expect.any(Number),
    endedAt: expect.any(String),
    startedAt: expect.any(String),
    failures: 1,
    passes: 2,
    pending: 0,
    skipped: 0,
    suites: 1,
    tests: 3,
  },
  reporter: "spec",
  reporterStats: {
    suites: 1,
    tests: 3,
    passes: 2,
    pending: 0,
    failures: 1,
    start: expect.any(String),
    end: expect.any(String),
    duration: expect.any(Number),
  },
  spec: {
    // baseName: "b.spec.js",
    // specFileExtension: ".spec.js",
    // relativeToCommonRoot: "b.spec.js",
    // specType: "integration",
    fileExtension: ".js",
    fileName: "b",
    name: "b.spec.js",
    relative: "cypress/e2e/b.spec.js",
    absolute: expect.stringMatching("b.spec.js"),
  },
  error: null,
  video: expect.any(String),
  shouldUploadVideo: true,
  hooks: null,
  tests: [
    {
      testId: "r3",
      title: [
        "Failing test with 2 attempts, passed test and flaky test with 2 attempts",
        "should try 2 times",
      ],
      state: "failed",
      body: "() => {\n    cy.wrap(false).should('be.true');\n  }",
      displayError:
        "AssertionError: Timed out retrying after 4000ms: expected false to be true\n    at Context.eval (webpack://cypress-13-demo/./cypress/e2e/b.spec.js:6:19)",
      attempts: [
        {
          state: "failed",
          error: {
            name: "AssertionError",
            message:
              "Timed out retrying after 4000ms: expected false to be true",
            stack: expect.any(String),
            codeFrame: {
              line: 6,
              column: 20,
              originalFile: "cypress/e2e/b.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/b.spec.js",
              absoluteFile: expect.stringContaining("b.spec.js"),
              frame:
                "  4 |     retries: 2,\n  5 |   }, () => {\n> 6 |     cy.wrap(false).should('be.true');\n    |                    ^\n  7 |   });\n  8 | \n  9 |   it('should assert that true is true', () => {",
              language: "js",
            },
          },
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            getScreenshot({
              name: null,
              testId: "r3",
              testAttemptIndex: 0,
            }),
          ],
        },
        {
          state: "failed",
          error: {
            name: "AssertionError",
            message:
              "Timed out retrying after 4000ms: expected false to be true",
            stack: expect.any(String),
            codeFrame: {
              line: 6,
              column: 20,
              originalFile: "cypress/e2e/b.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/b.spec.js",
              absoluteFile: expect.stringContaining("b.spec.js"),
              frame:
                "  4 |     retries: 2,\n  5 |   }, () => {\n> 6 |     cy.wrap(false).should('be.true');\n    |                    ^\n  7 |   });\n  8 | \n  9 |   it('should assert that true is true', () => {",
              language: "js",
            },
          },
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            getScreenshot({
              name: null,
              testId: "r3",
              testAttemptIndex: 1,
            }),
          ],
        },
        {
          state: "failed",
          error: {
            name: "AssertionError",
            message:
              "Timed out retrying after 4000ms: expected false to be true",
            stack: expect.any(String),
            codeFrame: {
              line: 6,
              column: 20,
              originalFile: "cypress/e2e/b.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/b.spec.js",
              absoluteFile: expect.stringContaining("b.spec.js"),
              frame:
                "  4 |     retries: 2,\n  5 |   }, () => {\n> 6 |     cy.wrap(false).should('be.true');\n    |                    ^\n  7 |   });\n  8 | \n  9 |   it('should assert that true is true', () => {",
              language: "js",
            },
          },
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            getScreenshot({
              name: null,
              testId: "r3",
              testAttemptIndex: 2,
            }),
          ],
        },
      ],
    },
    {
      testId: "r4",
      title: [
        "Failing test with 2 attempts, passed test and flaky test with 2 attempts",
        "should assert that true is true",
      ],
      state: "passed",
      body: "() => {\n    cy.wrap(true).should('be.true');\n  }",
      displayError: null,
      attempts: [
        {
          state: "passed",
          error: null,
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [],
        },
      ],
    },
    {
      testId: "r5",
      title: [
        "Failing test with 2 attempts, passed test and flaky test with 2 attempts",
        "should fail on the first attempt and pass on the second",
      ],
      state: "passed",
      body: "() => {\n    if (attempt === 0) {\n      attempt++;\n      cy.wrap(false).should('be.true'); // This will fail on the first attempt\n    } else {\n      cy.wrap(true).should('be.true'); // This will pass on the second attempt\n    }\n  }",
      displayError: null,
      attempts: [
        {
          state: "failed",
          error: {
            name: "AssertionError",
            message:
              "Timed out retrying after 4000ms: expected false to be true",
            stack: expect.any(String),
            codeFrame: {
              line: 16,
              column: 22,
              originalFile: "cypress/e2e/b.spec.js",
              relativeFile: "e2e/cypress-13-demo/cypress/e2e/b.spec.js",
              absoluteFile: expect.stringContaining("b.spec.js"),
              frame:
                "  14 |     if (attempt === 0) {\n  15 |       attempt++;\n> 16 |       cy.wrap(false).should('be.true');  // This will fail on the first attempt\n     |                      ^\n  17 |     } else {\n  18 |       cy.wrap(true).should('be.true');   // This will pass on the second attempt\n  19 |     }",
              language: "js",
            },
          },
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [
            getScreenshot({
              name: null,
              testId: "r5",
              testAttemptIndex: 0,
            }),
          ],
        },
        {
          state: "passed",
          error: null,
          timings: expect.any(Object),
          failedFromHookId: null,
          wallClockStartedAt: expect.any(String),
          wallClockDuration: expect.any(Number),
          videoTimestamp: expect.any(Number),
          startedAt: expect.any(String),
          duration: expect.any(Number),
          screenshots: [],
        },
      ],
    },
  ],
};
export const config = {
  additionalIgnorePattern: [],
  animationDistanceThreshold: 5,
  arch: "arm64",
  autoOpen: false,
  baseUrl: "https://todomvc.com/examples/vanillajs",
  blockHosts: null,
  browsers: [
    {
      name: "chrome",
      family: "chromium",
      channel: "stable",
      displayName: "Chrome",
      version: "116.0.5845.187",
      path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      minSupportedVersion: 64,
      majorVersion: "116",
    },
    {
      name: "edge",
      family: "chromium",
      channel: "stable",
      displayName: "Edge",
      version: "116.0.1938.81",
      path: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      minSupportedVersion: 79,
      majorVersion: "116",
    },
    {
      name: "electron",
      channel: "stable",
      family: "chromium",
      displayName: "Electron",
      version: "106.0.5249.51",
      path: "",
      majorVersion: 106,
    },
  ],
  chromeWebSecurity: true,
  clientCertificates: [],
  clientRoute: "/__/",
  configFile:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo/cypress.config.ts",
  cypressBinaryRoot:
    "/Users/miguelangarano/Library/Caches/Cypress/12.17.4/Cypress.app/Contents/Resources/app",
  cypressEnv: "production",
  defaultCommandTimeout: 4000,
  devServerPublicPathRoute: "/__cypress/src",
  downloadsFolder:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo/cypress/downloads",
  env: {
    currents_temp_file:
      "/var/folders/1l/tzj2dqys6js7w35f8rx2jsq00000gn/T/tmp-45859-JGguqnT5L2dB",
    currents_debug_enabled: false,
  },
  excludeSpecPattern: "*.hot-update.js",
  execTimeout: 60000,
  experimentalCspAllowList: false,
  experimentalFetchPolyfill: false,
  experimentalInteractiveRunEvents: false,
  experimentalMemoryManagement: false,
  experimentalModifyObstructiveThirdPartyCode: false,
  experimentalOriginDependencies: false,
  experimentalRunAllSpecs: false,
  experimentalSingleTabRunMode: false,
  experimentalSkipDomainInjection: null,
  experimentalSourceRewriting: false,
  experimentalStudio: false,
  experimentalWebKitSupport: false,
  fileServerFolder:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo",
  fixturesFolder:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo/cypress/fixtures",
  hosts: null,
  includeShadowDom: false,
  isInteractive: true,
  isTextTerminal: true,
  keystrokeDelay: 0,
  modifyObstructiveCode: true,
  morgan: false,
  namespace: "__cypress",
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 60000,
  platform: "darwin",
  port: null,
  projectId: null,
  projectName: "cypress-13-demo",
  projectRoot:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo",
  rawJson: {
    video: true,
    e2e: {
      baseUrl: "https://todomvc.com/examples/vanillajs",
      supportFile: "cypress/support/e2e.ts",
      specPattern: "cypress/*/**/*.spec.js",
      setupNodeEvents: "[Function setupNodeEvents]",
    },
    component: {
      specPattern: ["pages/__tests__/*.spec.tsx"],
      setupNodeEvents: "[Function setupNodeEvents]",
      devServer: { framework: "next", bundler: "webpack" },
    },
    baseUrl: "https://todomvc.com/examples/vanillajs",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/*/**/*.spec.js",
    setupNodeEvents: "[Function setupNodeEvents]",
    envFile: {},
    projectRoot:
      "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo",
    projectName: "cypress-13-demo",
    repoRoot:
      "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13",
  },
  redirectionLimit: 20,
  repoRoot:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13",
  report: true,
  reporter: "spec",
  reporterOptions: null,
  reporterRoute: "/__cypress/reporter",
  requestTimeout: 5000,
  resolved: {
    animationDistanceThreshold: { value: 5, from: "default" },
    arch: { value: "arm64", from: "default" },
    baseUrl: {
      value: "https://todomvc.com/examples/vanillajs",
      from: "config",
    },
    blockHosts: { value: null, from: "default" },
    chromeWebSecurity: { value: true, from: "default" },
    clientCertificates: { value: [], from: "default" },
    defaultCommandTimeout: { value: 4000, from: "default" },
    downloadsFolder: { value: "cypress/downloads", from: "default" },
    env: {
      currents_temp_file: {
        value:
          "/var/folders/1l/tzj2dqys6js7w35f8rx2jsq00000gn/T/tmp-45859-JGguqnT5L2dB",
        from: "cli",
      },
      currents_debug_enabled: { value: false, from: "cli" },
    },
    execTimeout: { value: 60000, from: "default" },
    experimentalCspAllowList: { value: false, from: "default" },
    experimentalFetchPolyfill: { value: false, from: "default" },
    experimentalInteractiveRunEvents: { value: false, from: "default" },
    experimentalRunAllSpecs: { value: false, from: "default" },
    experimentalMemoryManagement: { value: false, from: "default" },
    experimentalModifyObstructiveThirdPartyCode: {
      value: false,
      from: "default",
    },
    experimentalSkipDomainInjection: { value: null, from: "default" },
    experimentalOriginDependencies: { value: false, from: "default" },
    experimentalSourceRewriting: { value: false, from: "default" },
    experimentalSingleTabRunMode: { value: false, from: "default" },
    experimentalStudio: { value: false, from: "default" },
    experimentalWebKitSupport: { value: false, from: "default" },
    fileServerFolder: { value: "", from: "default" },
    fixturesFolder: { value: "cypress/fixtures", from: "default" },
    excludeSpecPattern: { value: "*.hot-update.js", from: "default" },
    includeShadowDom: { value: false, from: "default" },
    keystrokeDelay: { value: 0, from: "default" },
    modifyObstructiveCode: { value: true, from: "default" },
    nodeVersion: { from: "default" },
    numTestsKeptInMemory: { value: 0, from: "config" },
    platform: { value: "darwin", from: "default" },
    pageLoadTimeout: { value: 60000, from: "default" },
    port: { value: null, from: "default" },
    projectId: { value: null, from: "default" },
    redirectionLimit: { value: 20, from: "default" },
    reporter: { value: "spec", from: "default" },
    reporterOptions: { value: null, from: "default" },
    requestTimeout: { value: 5000, from: "default" },
    resolvedNodePath: { value: null, from: "default" },
    resolvedNodeVersion: { value: null, from: "default" },
    responseTimeout: { value: 30000, from: "default" },
    retries: {
      value: { runMode: 0, openMode: 0 },
      from: "default",
    },
    screenshotOnRunFailure: { value: true, from: "default" },
    screenshotsFolder: {
      value: "cypress/screenshots",
      from: "default",
    },
    slowTestThreshold: { value: 10000, from: "default" },
    scrollBehavior: { value: "top", from: "default" },
    supportFile: { value: "cypress/support/e2e.ts", from: "config" },
    supportFolder: { value: false, from: "default" },
    taskTimeout: { value: 60000, from: "default" },
    testIsolation: { value: true, from: "default" },
    trashAssetsBeforeRuns: { value: true, from: "default" },
    userAgent: { value: null, from: "default" },
    video: { value: true, from: "default" },
    videoCompression: { value: 32, from: "default" },
    videosFolder: { value: "cypress/videos", from: "default" },
    videoUploadOnPasses: { value: true, from: "default" },
    viewportHeight: { value: 660, from: "default" },
    viewportWidth: { value: 1000, from: "default" },
    waitForAnimations: { value: true, from: "default" },
    watchForFileChanges: { value: false, from: "config" },
    specPattern: { value: "cypress/*/**/*.spec.js", from: "config" },
    browsers: {
      value: [
        {
          name: "chrome",
          family: "chromium",
          channel: "stable",
          displayName: "Chrome",
          version: "116.0.5845.187",
          path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          minSupportedVersion: 64,
          majorVersion: "116",
        },
        {
          name: "edge",
          family: "chromium",
          channel: "stable",
          displayName: "Edge",
          version: "116.0.1938.81",
          path: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
          minSupportedVersion: 79,
          majorVersion: "116",
        },
        {
          name: "electron",
          channel: "stable",
          family: "chromium",
          displayName: "Electron",
          version: "106.0.5249.51",
          path: "",
          majorVersion: 106,
        },
      ],
      from: "runtime",
    },
    hosts: { value: null, from: "default" },
    isInteractive: { value: true, from: "default" },
  },
  resolvedNodePath:
    "/Users/miguelangarano/.nvm/versions/node/v18.14.2/bin/node",
  resolvedNodeVersion: "18.14.2",
  responseTimeout: 30000,
  retries: { runMode: 0, openMode: 0 },
  screenshotOnRunFailure: true,
  screenshotsFolder:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo/cypress/screenshots",
  scrollBehavior: "top",
  setupNodeEvents: "[Function setupNodeEvents]",
  slowTestThreshold: 10000,
  socketId: "ijm5bzfgh0",
  socketIoCookie: "__socket",
  socketIoRoute: "/__socket",
  specPattern: "cypress/*/**/*.spec.js",
  supportFile:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo/cypress/support/e2e.ts",
  supportFolder:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo/cypress/support",
  taskTimeout: 60000,
  testIsolation: true,
  trashAssetsBeforeRuns: true,
  userAgent: null,
  version: "12.17.4",
  video: true,
  videoCompression: 32,
  videoUploadOnPasses: true,
  videosFolder:
    "/Users/miguelangarano/Documents/GitHub/cypress-cloud-private-fix-cypress-13/e2e/cypress-13-demo/cypress/videos",
  viewportHeight: 660,
  viewportWidth: 1000,
  waitForAnimations: true,
  watchForFileChanges: false,
  testingType: "e2e",
};

export const all = {
  totalDuration: 33459,
  totalSuites: 5,
  totalPending: 1,
  totalFailed: 3,
  totalSkipped: 0,
  totalPassed: 4,
  totalTests: 8,
  runs: [specA, specE, specD, specC, specB],
  startedTestsAt: "2023-09-14T03:08:15.698Z",
  endedTestsAt: "2023-09-14T03:09:02.909Z",
  config,
  status: "finished",
  runUrl: "https://app.currents.dev/run/7dc0426fc25d30fe",
};

export const specs = {
  "a.spec.js": specA,
  "b.spec.js": specB,
  "c.spec.js": specC,
  "d.spec.js": specD,
  "e.spec.js": specE,
};
