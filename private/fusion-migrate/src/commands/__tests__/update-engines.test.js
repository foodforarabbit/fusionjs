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

test('updateEngines', async () => {
  const dir = tmp.dirSync().name;
  await ncp(fixtureDir, dir);
  await updateEngines({
    destDir: dir,
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  assert.equal(typeof finalPackage.engines.node, 'string');
  assert.equal(typeof finalPackage.engines.npm, 'string');
  assert.equal(typeof finalPackage.engines.yarn, 'string');
});
