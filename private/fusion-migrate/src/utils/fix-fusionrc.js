const fs = require('fs');

module.exports = destDir => {
  try {
    const data = JSON.parse(
      fs.readFileSync(`${destDir}/package.json`, 'utf-8')
    );
    if (!data.dependencies)
      fs.writeFileSync(
        `${destDir}/.fusionrc.js`,
        `module.exports = require('../../.fusionrc.js');`,
        'utf-8'
      );
  } catch (e) {
    // ignore if we're not exactly at root of a service in a monorepo
  }
};
