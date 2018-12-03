const modNormalizeTape = require('./codemods/normalize-tape/plugin.js');
const modDeepLooseEqual = require('./codemods/deep-loose-equal/plugin.js');
const modUpgradeEnzyme = require('./codemods/upgrade-enzyme/plugin.js');
const modRemoveEnzymeAdapter = require('./codemods/remove-enzyme-adapter/plugin.js');
const renameTestFiles = require('./commands/rename-test-files.js');
const jestCodemods = require('./commands/jest-codemods.js');
const codemodStep = require('./utils/codemod-step.js');
const updateDeps = require('./commands/update-deps.js');
const updateScripts = require('./commands/update-scripts.js');
const updateFiles = require('./commands/update-files.js');
const modTestCleanup = require('./codemods/test-cleanup/plugin.js');
const addDiffSteps = require('./utils/add-diff-steps.js');
const lintFix = require('./utils/lint-fix.js');
const removeEmptyTestFiles = require('./commands/remove-empty-test-files.js');
const modFixTestImports = require('./codemods/fix-test-imports/plugin.js');

module.exports = function getTestSteps(options) {
  return [
    {
      id: 'add-deps',
      step: () =>
        updateDeps({
          ...options,
          modulesToRemove: ['tape', '@uber/test-tasks'],
          modulesToAdd: [],
          modulesToUpgrade: [],
        }),
    },
    {
      id: 'update-scripts',
      step: () =>
        updateScripts({
          ...options,
          filter: item => ['test', 'cover'].includes(item),
        }),
    },
    {
      id: 'update-files',
      step: () => {
        updateFiles({
          ...options,
          add: [],
          remove: ['gulpfile-dev.js'],
        });
      },
    },
    {
      id: 'normalize-tape',
      step: () =>
        codemodStep({
          ...options,
          plugin: modNormalizeTape,
          filter: f => f.includes('src/test'),
        }),
    },
    {
      id: 'deep-loose-equal',
      step: () =>
        codemodStep({
          ...options,
          plugin: modDeepLooseEqual,
          filter: f => f.includes('src/test'),
        }),
    },
    {
      id: 'upgrade-enzyme',
      step: () =>
        codemodStep({
          ...options,
          plugin: modUpgradeEnzyme,
          filter: f => f.includes('src/test'),
        }),
    },
    {
      id: 'remove-enzyme-adapter',
      step: () =>
        codemodStep({
          ...options,
          plugin: modRemoveEnzymeAdapter,
          filter: f => f.includes('src/test-utils/test-app.js'),
        }),
    },
    {id: 'jest-codemods', step: () => jestCodemods(options)},
    {id: 'rename-test-files', step: () => renameTestFiles()},
    {
      id: 'test-cleanup',
      step: () =>
        codemodStep({
          ...options,
          plugin: modTestCleanup,
          filter: f =>
            f.includes('src/__tests__') || f.includes('src/test-utils'),
        }),
    },
    modFixTestImports,
    {
      id: 'remove-empty-test-files',
      step: () => removeEmptyTestFiles(options),
    },
    {id: 'prettier', step: () => lintFix(options.destDir)},
  ].reduce(addDiffSteps(options), []);
};
