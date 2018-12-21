const updateEngines = require('./commands/update-engines.js');
const setupYarn = require('./commands/setup-yarn.js');

module.exports = function getSteps(options) {
  return [
    {id: 'update-engines', step: () => updateEngines(options)},
    {id: 'setup-yarn', step: () => setupYarn(options)},
  ];
};
