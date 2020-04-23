// @flow

import React from 'react';
import renderTest from '../../test-utils/render-test';

import Welcome from '../welcome';

test('Welcome', async () => {
  const result = await renderTest(<Welcome />);
  expect(result.getByText('Welcome')).toMatchInlineSnapshot(`
    <h1
      class="_ai _aj _ak _al _am"
    >
      Welcome
    </h1>
  `);
});
