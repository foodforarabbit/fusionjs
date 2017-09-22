const test = require('tape');

const grapheneAtreyu = require('../');

test('grapheneAtreyu', function t(assert) {
  assert.ok(typeof grapheneAtreyu === 'function',
    'exported correctly');

  assert.end();
});
