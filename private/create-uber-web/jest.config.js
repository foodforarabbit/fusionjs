module.exports = {
  setupFiles: ["<rootDir>/test-setup.js"],
  testRegex: "src/(commands|utils|codemods)/.*?.test.js",
  coverageReporters: ["text", "cobertura"]
};
