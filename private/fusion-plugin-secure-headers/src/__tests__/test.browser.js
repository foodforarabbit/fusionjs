// @flow
import test from 'tape-cup';

import SecureHeadersPlugin from '../browser';

test('export null as expected', t => {
  t.equal(SecureHeadersPlugin, null, 'plugin defined as null');
  t.end();
});
