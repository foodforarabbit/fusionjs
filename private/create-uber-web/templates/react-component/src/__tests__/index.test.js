// @flow
import {shallow} from 'enzyme';
import React from 'react';
import Hello from '../index.js';

test('first test', () => {
  expect(shallow(<Hello />).text()).toEqual('Hello world');
});
