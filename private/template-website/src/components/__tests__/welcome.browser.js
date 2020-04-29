// @flow

import * as React from 'react';
import {render} from '@testing-library/react';

import Welcome from '../welcome';

test('Welcome', async () => {
  const {getByText} = render(<Welcome />);
  const element = getByText('Welcome');
  expect(element).toBeDefined();
});
