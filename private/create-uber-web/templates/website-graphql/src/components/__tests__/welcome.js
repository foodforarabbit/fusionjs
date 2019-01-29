// @flow

import React from 'react';
import {shallow} from 'enzyme';

import Welcome from '../welcome';

test('Welcome', async () => {
  const wrapper = shallow(<Welcome />);
  expect(wrapper).toMatchSnapshot();
});
