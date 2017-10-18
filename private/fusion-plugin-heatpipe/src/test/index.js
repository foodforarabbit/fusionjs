const test = require('tape');

const grapheneHeatpipe = require('../');

test('grapheneHeatpipe', function t(assert) {
  assert.ok(typeof grapheneHeatpipe === 'function',
    'exported correctly');

  assert.end();
});
