// TODO: unskip tests. Skipping now because there are issues with running git commands on CI
const fs = require('fs');
const path = require('path');
const execa = require('execa');
const tmp = require('tmp');
const {promisify} = require('util');
const ncp = promisify(require('ncp'));

const flowconfigStep = require('../flowconfig-step.js');

const originalFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/flowconfig-step-fixture/config/'
);

const simpleFlowconfigMod = () => {
  return {
    name: 'simple-flowconfig-plugin',
    transform: lines => {
      lines.push('A simple line added!');
      return lines;
    },
  };
};

test.skip('flowconfig-step', async () => {
  const destDir = tmp.dirSync().name;
  await ncp(originalFixtureDir, destDir);
  await execa.shell(`git init && git add .`, {cwd: destDir});
  const matchedFiles = await flowconfigStep({
    destDir,
    plugin: simpleFlowconfigMod,
  });
  matchedFiles
    .map(f => path.join(destDir, f))
    .forEach(f => {
      expect(fs.readFileSync(f).toString()).toMatchSnapshot();
    });
});
