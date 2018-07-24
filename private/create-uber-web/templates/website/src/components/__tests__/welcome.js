// @flow

import React from 'react';
import {test} from 'fusion-test-utils';
import {shallow} from 'enzyme';

import Welcome from '../welcome';

test('Welcome', async assert => {
  const wrapper = shallow(<Welcome />);
  assert.matchSnapshot(wrapper);
});
