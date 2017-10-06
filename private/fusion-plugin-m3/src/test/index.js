const test = require('tape');

const grapheneM3 = require('../');

test('grapheneM3', function t(assert) {
  assert.ok(typeof grapheneM3 === 'function',
    'exported correctly');

  assert.end();
});
