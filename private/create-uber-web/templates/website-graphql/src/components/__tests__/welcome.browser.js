// @flow

import React from 'react';
import renderTest from '../../test-utils/render-test';

import Welcome from '../welcome';

test('Welcome', async () => {
  const result = await renderTest(<Welcome />);
  expect(result.getByText('Welcome')).toMatchInlineSnapshot(`
    <h1
      class="_an _ao _ap _aq"
    >
      Welcome
    </h1>
  `);
});
