// @flow

import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Welcome from '../welcome';

Enzyme.configure({adapter: new Adapter()});

test('Welcome', async () => {
  const wrapper = shallow(<Welcome />);
  expect(wrapper).toMatchSnapshot();
});
