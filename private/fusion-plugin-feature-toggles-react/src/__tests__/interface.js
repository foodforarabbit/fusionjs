// @flow

import Plugin, {Toggle} from '../index.js';

test('interface', () => {
  expect(typeof Plugin.provides).toEqual('function');
  expect(typeof Toggle).toEqual('function');
});
