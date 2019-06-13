// @flow
/* eslint-env browser */
import tape from 'tape-cup';

import FliprPlugin from '../browser.js';

tape('plugin - exported corectly', (t): void => {
  t.ok(FliprPlugin, 'plugin exported correctly');
  // $FlowFixMe
  t.equal(FliprPlugin.provides, undefined, 'service is undefined');
  // $FlowFixMe
  t.equal(FliprPlugin.middleware, undefined, 'middleware is undefined');
  t.end();
});
