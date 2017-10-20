const test = require('tape');

const grapheneTracer = require('../');

test('grapheneTracer', function t(assert) {
  assert.ok(typeof grapheneTracer === 'function',
    'exported correctly');

  assert.end();
});
