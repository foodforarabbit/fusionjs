const execa = require('execa');

module.exports = async function getJSFiles(destDir) {
  const result = await execa.shell('git ls-files', {cwd: destDir});
  return result.stdout
    .split('\n')
    .filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
};
