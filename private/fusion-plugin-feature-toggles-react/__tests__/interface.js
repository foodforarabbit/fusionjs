// @flow

import Plugin, {Toggle} from '../src/index.js';

test('interface', () => {
  expect(typeof Plugin.provides).toEqual('function');
  expect(typeof Toggle).toEqual('function');
});
