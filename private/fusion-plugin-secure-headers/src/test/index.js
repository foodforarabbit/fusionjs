const test = require('tape');

const grapheneSecureHeaders = require('../');

test('grapheneSecureHeaders', function t(assert) {
  assert.ok(typeof grapheneSecureHeaders === 'function',
    'exported correctly');

  assert.end();
});
