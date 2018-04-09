const assert = require('assert');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const checkMigrationVersion = require('../check-migration-version.js');

test('check-migration-version 14', () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@uber/bedrock': '^14.2.1',
      },
    })
  );
  let result = checkMigrationVersion(dir);
  assert.equal(result.error, undefined);
  assert.equal(result.version, 14);

  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@uber/bedrock': '14.0.0',
      },
    })
  );
  result = checkMigrationVersion(dir);
  assert.equal(result.error, undefined);
  assert.equal(result.version, 14);

  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@uber/bedrock': '>= 14.0.0',
      },
    })
  );
  result = checkMigrationVersion(dir);
  assert.equal(result.error, undefined);
  assert.equal(result.version, 14);
});

test('check-migration-version 13', () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@uber/bedrock': '^13.2.1',
      },
    })
  );
  const result = checkMigrationVersion(dir);
  assert.equal(result.error, undefined);
  assert.equal(result.version, 13);
});

test('check-migration-version < 13', () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@uber/bedrock': '^12.2.1',
      },
    })
  );
  const result = checkMigrationVersion(dir);
  assert.equal(typeof result.error, 'string');
  assert.equal(result.version, undefined);
});

test('check-migration-version no bedrock', () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@uber/something': '^12.2.1',
      },
    })
  );
  const result = checkMigrationVersion(dir);
  assert.equal(typeof result.error, 'string');
  assert.equal(result.version, undefined);
});

test('check-migration-version no dependencies', () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      name: 'test',
    })
  );
  const result = checkMigrationVersion(dir);
  assert.equal(typeof result.error, 'string');
  assert.equal(result.version, undefined);
});
