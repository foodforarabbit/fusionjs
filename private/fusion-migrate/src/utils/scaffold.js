const path = require('path');
const tmp = require('tmp');
const execa = require('execa');

module.exports = async function scaffold(options = {}) {
  const dirname = tmp.dirSync().name;
  await execa.shell(`git clone git@github.com:uber/fusionjs.git ${dirname}`);
  return path.join(dirname, 'private/create-uber-web/templates/website');
};
