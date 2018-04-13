const execa = require('execa');

module.exports = async function getChangedFiles(dir) {
  await execa.shell('git add .', {cwd: dir});
  const result = await execa.shell('git diff --name-only HEAD', {cwd: dir});
  return result.stdout
    .split('\n')
    .filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
};
