// @flow
/* eslint-env browser */
import tape from 'tape-cup';
import FliprPlugin from '../browser';

tape('plugin - exported corectly', t => {
  t.ok(FliprPlugin, 'plugin exported correctly');
  t.equal(FliprPlugin.provides, undefined, 'service is undefined');
  t.equal(FliprPlugin.middleware, undefined, 'middleware is undefined');
  t.end();
});
