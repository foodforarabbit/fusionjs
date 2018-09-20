const fs = require('fs');

module.exports = destDir => {
  try {
    const data = JSON.parse(
      fs.readFileSync(`${destDir}/package.json`, 'utf-8')
    );
    if (!data.dependencies) fs.unlinkSync(`${destDir}/.eslintrc.js`);
  } catch (e) {
    // ignore if we're not exactly at root of a service in a monorepo
  }
};
