// @flow
import hello from '../index.js';

test('first test', () => {
  expect(hello()).toEqual('hello world');
});
