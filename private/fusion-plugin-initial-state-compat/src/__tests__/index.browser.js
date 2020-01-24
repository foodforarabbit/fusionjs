// @flow
import getInitialState from '../index.js';

test('browser export', () => {
  expect(getInitialState).toBe(null);
});
