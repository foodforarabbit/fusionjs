const exec = require('execa');

module.exports = async function format(destDir) {
  await exec.shell('yarn lint --fix').catch(e => {});
};
