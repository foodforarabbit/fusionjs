const getTrackedFiles = require('./get-tracked-files.js');

module.exports = async function getJSFiles(destDir) {
  const files = await getTrackedFiles(destDir);
  return files.filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
};
