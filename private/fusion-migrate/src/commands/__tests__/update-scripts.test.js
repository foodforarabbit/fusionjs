// TODO: unskip tests. Skipping now because there are issues with running git commands on CI
const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const execa = require('execa');

const ncp = promisify(require('ncp'));
const tmp = require('tmp');
const updateScripts = require('../update-scripts.js');

const fixtureDir = path.join(
  __dirname,
  '../../__fixtures__/update-scripts-fixture/'
);
const srcFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/src-package-fixture/'
);
test.skip('updateScripts', async () => {
  const dir = tmp.dirSync().name;
  await ncp(fixtureDir, dir);
  await execa.shell('git init && git add .', {cwd: dir});
  await updateScripts({
    destDir: dir,
    srcDir: srcFixtureDir,
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  expect(finalPackage.scripts.test).toEqual('new test');
  expect(finalPackage.scripts.build).toEqual('new build');
  expect(finalPackage.scripts.__old__test).toEqual('old test');
  expect(finalPackage.scripts.__old__something).toEqual('something');
});

test.skip('updateScripts with scss files', async () => {
  const dir = tmp.dirSync().name;
  await ncp(fixtureDir, dir);
  await execa.shell(
    'mkdir -p src/client/stylesheets && touch src/client/stylesheets/main.scss',
    {cwd: dir}
  );
  await execa.shell('git init && git add .', {cwd: dir});
  await updateScripts({
    destDir: dir,
    srcDir: srcFixtureDir,
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  expect(finalPackage.scripts['compile-sass']).toMatch('node-sass');
  expect(finalPackage.scripts.predev).toEqual('yarn compile-sass');
  expect(finalPackage.scripts.prebuild).toEqual('yarn compile-sass');
  expect(finalPackage.scripts['prebuild-production']).toEqual(
    'yarn compile-sass'
  );
  expect(finalPackage.scripts.test).toEqual('new test');
  expect(finalPackage.scripts.build).toEqual('new build');
  expect(finalPackage.scripts.__old__test).toEqual('old test');
  expect(finalPackage.scripts.__old__something).toEqual('something');
});
