import test from 'tape';

import plugin from '../index';

test('plugin', function t(assert) {
  assert.ok(typeof plugin.provides === 'function', 'exported correctly');

  assert.end();
});
