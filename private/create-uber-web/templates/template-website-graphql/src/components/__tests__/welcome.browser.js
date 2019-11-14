// @flow

import React from 'react';
import renderTest from '../../test-utils/render-test';

import Welcome from '../welcome';

test('Welcome', async () => {
  const result = await renderTest(<Welcome />);
  expect(result.getByText('Welcome')).toMatchInlineSnapshot(`
    <div
      class="_ao _ap _aq _ar _as"
      data-baseweb="typo-display1"
    >
      Welcome
    </div>
  `);
});
