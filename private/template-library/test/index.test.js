// @flow
const {default: lib} = require('..');

test('first test', () => {
  expect(lib()).toEqual('hello world');
});
