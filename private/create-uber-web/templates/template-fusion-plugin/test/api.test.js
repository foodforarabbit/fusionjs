// @flow

const api = require('..');

test('plugin api', () => {
  expect(typeof api.default).toEqual('object');
  expect(typeof api.Token).toEqual('object');
});
