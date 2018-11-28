const updateEngines = require('./commands/update-engines.js');
const setupYarn = require('./commands/setup-yarn.js');
const addDiffSteps = require('./utils/add-diff-steps.js');

module.exports = function getSteps(options) {
  return [
    {id: 'update-engines', step: () => updateEngines(options)},
    {id: 'setup-yarn', step: () => setupYarn(options)},
  ].reduce(addDiffSteps(options), []);
};
