const {promisify} = require('util');
const fs = require('fs');
const path = require('path');

const getTrackedFiles = require('./get-tracked-files.js');

const writeFile = promisify(fs.writeFile);

module.exports = async function genericStep({
  destDir,
  filter,
  files,
  transform,
}) {
  // Determine reasonable defaults
  files = files || (await getTrackedFiles(destDir));
  if (filter) {
    files = files.filter(filter);
  }
  if (!transform) {
    transform = (joinedPath, file) => ({joinedPath, file});
  }

  const results = await Promise.all(
    files.map(file => {
      const joinedPath = path.join(destDir, file);
      return transform(joinedPath, file);
    })
  );

  await Promise.all(
    results.map(({joinedPath, content}) => {
      return writeFile(joinedPath, content);
    })
  );
  return files;
};
