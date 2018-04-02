const path = require('path');
const fs = require('fs');
const assert = require('assert');
const scaffold = require('../scaffold.js');

test('generating a scaffold works', async () => {
  const dir = await scaffold();
  assert.ok(fs.existsSync(path.join(dir, 'src/main.js')));
  assert.ok(fs.existsSync(path.join(dir, 'package.json')));
  assert.ok(fs.existsSync(path.join(dir, '.eslintrc.js')));
});
