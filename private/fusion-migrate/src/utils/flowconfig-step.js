const {promisify} = require('util');
const fs = require('fs');

const genericStep = require('./generic-step.js');

const readFile = promisify(fs.readFile);

module.exports = async function flowConfigStep({destDir, plugin}) {
  const filter = f => f.endsWith('.flowconfig');
  const transform = async (joinedPath, file) => {
    const fileContents = (await readFile(joinedPath)).toString();

    return {
      file: file,
      joinedPath: joinedPath,
      content: plugin()
        .transform(fileContents.split('\n'))
        .join('\n'),
    };
  };

  return genericStep({destDir, filter, transform});
};
