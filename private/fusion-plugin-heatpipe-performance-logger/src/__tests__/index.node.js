// @flow
import test from 'tape-cup';

import plugin from '../index';

test('plugin', function t(assert) {
  assert.ok(typeof plugin.provides === 'function', 'exported correctly');

  assert.end();
});
