// @flow

import {test, getSimulator} from 'fusion-test-utils';
import loadApp from '../../test-utils/test-app';

test('Root renders', async () => {
  const app = await loadApp();
  const sim = getSimulator(app);
  const ctx = await sim.render('/');
  expect(ctx.rendered.getByText('Welcome')).toMatchInlineSnapshot(`
    <div
      class="_ao _ap _aq _ar _as"
      data-baseweb="typo-display1"
    >
      Welcome
    </div>
  `);
});
