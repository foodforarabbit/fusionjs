// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

test('test', t => {
  const app = new App('el', el => el);
  getSimulator(app);
  expect(true).toEqual(true);
});
