const test = require('tape');

const grapheneFlipr = require('../');

test('grapheneFlipr', function t(assert) {
  assert.ok(typeof grapheneFlipr === 'function',
    'exported correctly');

  assert.end();
});
