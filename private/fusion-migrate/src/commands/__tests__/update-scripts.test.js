const assert = require('assert');
const fs = require('fs');
const path = require('path');
const exec = require('execa');
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
test('updateScripts', async () => {
  const dir = tmp.dirSync().name;
  await exec.shell(`cp -R ${fixtureDir} ${dir}`);
  await updateScripts({
    destDir: dir,
    srcDir: srcFixtureDir,
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  assert.equal(finalPackage.scripts.test, 'new test');
  assert.equal(finalPackage.scripts.build, 'new build');
  assert.equal(finalPackage.scripts['__old__test'], 'old test');
  assert.equal(finalPackage.scripts['__old__something'], 'something');
});
