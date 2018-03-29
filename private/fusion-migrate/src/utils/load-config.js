const path = require('path');
const fs = require('fs');

module.exports = function loadConfig(dir) {
  const common = loadFile(dir, 'common.json');
  const prod = loadFile(dir, 'production.json');
  const development = loadFile(dir, 'development.json');
  const local = loadFile(dir, 'local.json');

  return {
    common,
    prod,
    dev: {
      ...development,
      ...local,
    },
  };
};

function loadFile(dir, name) {
  try {
    const file = fs.readFileSync(path.join(dir, 'config', name));
    return JSON.parse(file.toString());
  } catch (e) {
    return {};
  }
}
