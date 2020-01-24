// @flow
/* eslint-env node */

const fixme = {
  collectCoverage: true,
  collectCoverageFrom: ["dist-(browser|node)-cjs/**/*.js", "!src"],
  coverageDirectory: "coverage",
  coverageReporters: ["cobertura", "html", "json", "text-summary", "text"],
  projects: [
    {
      displayName: "browser",
      browser: true,
      testEnvironment: "jest-environment-jsdom-global",
      testPathIgnorePatterns: ["/node_modules/", "/dist/", ".*\\.node\\.js"],
      testURL: "http://localhost",
      globals: {
        __DEV__: true,
        __NODE__: false,
        __BROWSER__: true
      }
    },
    {
      displayName: "server",
      browser: false,
      testEnvironment: "node",
      testPathIgnorePatterns: ["/node_modules/", "/dist/", ".*\\.browser\\.js"],
      globals: {
        __DEV__: true,
        __NODE__: true,
        __BROWSER__: false
      }
    }
  ]
};

module.exports = {
  projects: [
    {
      displayName: "node",
      testEnvironment: "node",
      testPathIgnorePatterns: ["/node_modules/", ".browser.js", "dist"],
      globals: {
        __NODE__: true,
        __BROWSER__: false,
        __DEV__: true
      }
    },
    {
      displayName: "browser",
      testEnvironment: "jsdom",
      testPathIgnorePatterns: ["/node_modules/", ".node.js", "dist"],
      globals: {
        __NODE__: false,
        __BROWSER__: true,
        __DEV__: true
      }
    }
  ]
};
