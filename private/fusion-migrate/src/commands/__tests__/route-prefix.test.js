const {promisify} = require('util');
const fs = require('fs');
const path = require('path');

const ncp = promisify(require('ncp'));
const tmp = require('tmp');
const routePrefix = require('../route-prefix.js');

const srcFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/src-package-fixture/'
);
test('routePrefix', async () => {
  const dir = tmp.dirSync().name;
  await ncp(srcFixtureDir, dir);
  await routePrefix({
    destDir: dir,
    routePrefix: 'test',
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  expect(finalPackage.scripts.dev).toEqual('ROUTE_PREFIX=test SVC_ID=tmp dev');
  expect(finalPackage.scripts.start).toEqual('ROUTE_PREFIX=test start');
});

test('routePrefix with plain slash', async () => {
  const dir = tmp.dirSync().name;
  await ncp(srcFixtureDir, dir);
  await routePrefix({
    destDir: dir,
    routePrefix: '/',
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'))
  );
  expect(finalPackage.scripts.dev).toEqual('SVC_ID=tmp dev');
  expect(finalPackage.scripts.start).toEqual('start');
});
