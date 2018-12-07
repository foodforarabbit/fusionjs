// TODO: unskip tests. Skipping now because there are issues with running git commands on CI
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const scaffold = require('../scaffold.js');

jest.setTimeout(30000);

test.skip('generating a scaffold works', async () => {
  const dir = await scaffold();
  assert.ok(fs.existsSync(path.join(dir, 'src/main.js')));
  assert.ok(fs.existsSync(path.join(dir, 'package.json')));
  assert.ok(fs.existsSync(path.join(dir, '.eslintrc.js')));
});
