// @flow
import getInitialState from '../index.js';

test('getInitialState', () => {
  // $FlowFixMe
  expect(getInitialState({})).toStrictEqual({});

  // $FlowFixMe
  expect(getInitialState({res: {locals: {}}})).toStrictEqual({});

  // $FlowFixMe
  expect(getInitialState({res: {locals: {state: {test: true}}}})).toStrictEqual(
    {
      test: true,
    }
  );
});
