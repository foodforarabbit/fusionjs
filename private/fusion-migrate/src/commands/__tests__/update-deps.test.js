const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const ncp = promisify(require('ncp'));
const tmp = require('tmp');
const updateDeps = require('../update-deps.js');

const fixtureDir = path.join(__dirname, '../../__fixtures__/add-deps-fixture/');
const srcFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/src-package-fixture/'
);

test('updateDeps', async () => {
  const dir = tmp.dirSync().name;
  await ncp(fixtureDir, dir);
  await updateDeps({
    srcDir: srcFixtureDir,
    destDir: dir,
    modulesToRemove: [
      'just-compact',
      'just-flatten-it',
      'just-last',
      'just-compose',
    ],
    modulesToAdd: ['just-index', 'just-insert'],
    modulesToUpgrade: {
      a: '1.0.0',
      'just-partition': '1.0.0',
      'just-curry-it': '3.0.0',
    },
    stdio: 'pipe',
  });
  const finalPackage = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json')).toString()
  );
  const finalDeps = Object.keys(finalPackage.dependencies);
  const finalDevDeps = Object.keys(finalPackage.devDependencies);
  assert.ok(finalDeps.includes('just-map-object'));
  assert.ok(finalDeps.includes('just-omit'));
  assert.ok(finalDeps.includes('just-partition'));
  assert.ok(finalDeps.includes('just-insert'));
  assert.ok(finalDeps.includes('just-index'));
  assert.equal(finalPackage.dependencies['just-partition'], '1.0.0');
  assert.equal(finalPackage.devDependencies['just-curry-it'], '3.0.0');
  assert.equal(
    finalPackage.devDependencies['enzyme-adapter-react-15'],
    '^1.0.5'
  );
  assert.equal(finalDeps.length, 6);
  assert.ok(finalDevDeps.includes('enzyme-adapter-react-15'));
  assert.ok(finalDevDeps.includes('just-curry-it'));
  assert.ok(finalDevDeps.includes('just-entries'));
  assert.ok(finalDevDeps.includes('just-extend'));
  assert.equal(finalDevDeps.length, 4);
}, 15000);
