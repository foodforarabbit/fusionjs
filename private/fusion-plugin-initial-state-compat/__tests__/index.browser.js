// @flow
import getInitialState from '../src/index.js';

test('browser export', () => {
  expect(getInitialState).toBe(null);
});
