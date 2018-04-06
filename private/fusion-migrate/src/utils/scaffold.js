const {promisify} = require('util');
const path = require('path');
const tmp = require('tmp');

const getRemote = promisify(require('@uber/uber-web-remote-template').compile);

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
  await getRemote(options);
  return path.join(options.dirname, options.project);
};
