const fs = require('fs');
const assert = require('assert');
const path = require('path');
const exec = require('execa');
const tmp = require('tmp');
const updateDeps = require('../update-deps.js');

const fixtureDir = path.join(__dirname, '../../__fixtures__/add-deps-fixture/');
const srcFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/src-package-fixture/'
);

test('updateDeps', async () => {
  const dir = tmp.dirSync().name;
  await exec.shell(`cp -R ${fixtureDir} ${dir}`);
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
  assert.equal(finalDeps.length, 5);
  assert.ok(finalDevDeps.includes('just-curry-it'));
  assert.ok(finalDevDeps.includes('just-entries'));
  assert.ok(finalDevDeps.includes('just-extend'));
  assert.equal(finalDevDeps.length, 3);
});
