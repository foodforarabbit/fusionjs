const path = require('path');
const tmp = require('tmp');
const execa = require('execa');

module.exports = async function scaffold(options = {}) {
  const destClonePath = tmp.dirSync().name;
  const dirname = tmp.dirSync().name;
  const project = 'tmp';
  options = {
    repo: {
      remote:
        'gitolite@code.uber.internal:web/uber-web-template-fusion-website',
      name: 'remote-template-website',
    },
    destClonePath,
    dirname,
    project,
    // TODO: do we care about this?
    websiteType: 'internal',
    ...options,
  };
  await execa.shell(
    `git clone gitolite@code.uber.internal:web/create-uber-web ${dirname}`
  );
  return path.join(options.dirname, 'templates/website');
};
