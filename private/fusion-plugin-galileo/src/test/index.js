const test = require('tape');

const grapheneGalileo = require('../');

test('grapheneGalileo', function t(assert) {
  assert.ok(typeof grapheneGalileo === 'function',
    'exported correctly');

  assert.end();
});
