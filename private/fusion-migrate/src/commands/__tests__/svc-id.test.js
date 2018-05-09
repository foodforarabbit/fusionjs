const {promisify} = require('util');
const fs = require('fs');
const path = require('path');

const ncp = promisify(require('ncp'));
const tmp = require('tmp');
const svcId = require('../svc-id.js');

const srcFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/src-package-fixture/'
);
test('svcId', async () => {
  const dir = tmp.dirSync().name;
  await ncp(srcFixtureDir, dir);
  svcId({
    destDir: dir,
    svcId: 'test',
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  expect(finalPackage.scripts.dev).toEqual('SVC_ID=test dev');
});
