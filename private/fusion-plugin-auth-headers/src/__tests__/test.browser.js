// @flow
import test from 'tape-cup';

import AuthHeadersPlugin from '../browser';

test('null exported as expected', t => {
  t.equal(AuthHeadersPlugin, null, 'plugin null as expected');
  t.end();
});
