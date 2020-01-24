// @flow

import * as LogtronPlugin from '@uber/fusion-plugin-logtron';
import * as ReactLogtronPlugin from '../index.js';

test('sanity - exports include all from fusion-plugin-logtron', async () => {
  expect(LogtronPlugin).toBeTruthy();
  expect(ReactLogtronPlugin).toBeTruthy();

  // Ensure all exports in Logtron package are exported from ../index.js
  Object.keys(LogtronPlugin).forEach((key: string) => {
    expect(ReactLogtronPlugin[key]).toBeTruthy();
  });
});
