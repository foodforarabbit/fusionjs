const execa = require('execa');

module.exports = function lintFix({destDir}) {
  return execa.shell(`yarn run lint --fix || true;`, {cwd: destDir});
};
