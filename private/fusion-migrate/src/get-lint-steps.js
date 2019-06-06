const updateEngines = require('./commands/update-engines.js');
const setupYarn = require('./commands/setup-yarn.js');
const fixEslintConfig = require('./utils/fix-eslint-config.js');
const updateScripts = require('./commands/update-scripts.js');
const updateFiles = require('./commands/update-files.js');
const updateDeps = require('./commands/update-deps.js');
const lintFix = require('./utils/lint-fix.js');

module.exports = function getSteps(options) {
  return [
    {id: 'update-engines', step: () => updateEngines(options)},
    {id: 'setup-yarn', step: () => setupYarn(options)},
    {id: 'fix-eslint-config', step: () => fixEslintConfig(options.destDir)},
    {
      id: 'update-scripts',
      step: () =>
        updateScripts({
          ...options,
          filter: item => item === 'lint',
        }),
    },
    {
      id: 'update-files',
      step: () =>
        updateFiles({...options, add: ['.eslintrc.js'], remove: ['.eslintrc']}),
    },
    {
      id: 'update-deps',
      step: () =>
        updateDeps({
          ...options,
          modulesToAdd: [],
          modulesToRemove: [
            '@uber/eslint-config',
            '@uber/eslint-config-es6',
            '@uber/eslint-config-jsx',
            'jsonlint',
          ],
        }),
    },
    {id: 'prettier', step: () => lintFix(options.destDir)},
  ];
};
