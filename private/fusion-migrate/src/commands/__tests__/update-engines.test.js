const {promisify} = require('util');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ncp = promisify(require('ncp'));
const tmp = require('tmp');
const updateEngines = require('../update-engines.js');

const fixtureDir = path.join(
  __dirname,
  '../../__fixtures__/update-engines-fixture/'
);
const srcFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/src-package-fixture/'
);

test('updateEngines', async () => {
  const dir = tmp.dirSync().name;
  await ncp(fixtureDir, dir);
  await updateEngines({
    destDir: dir,
    srcDir: srcFixtureDir,
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  assert.equal(finalPackage.engines.node, '8.0.0');
  assert.equal(finalPackage.engines.npm, '5.0.0');
  assert.equal(finalPackage.engines.yarn, '1.0.0');
});
