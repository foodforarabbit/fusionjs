// @flow

import * as LogtronPlugin from '@uber/fusion-plugin-logtron';
import * as ReactLogtronPlugin from '../index.js';

import test from 'tape-cup';

test('sanity - exports include all from fusion-plugin-logtron', async t => {
  t.ok(LogtronPlugin);
  t.ok(ReactLogtronPlugin);

  // Ensure all exports in Logtron package are exported from ../index.js
  Object.keys(LogtronPlugin).forEach((key: string) => {
    t.ok(ReactLogtronPlugin[key]);
  });

  t.end();
});
