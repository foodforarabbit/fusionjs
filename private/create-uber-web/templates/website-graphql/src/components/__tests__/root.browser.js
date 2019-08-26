// @flow

import {test, getSimulator} from 'fusion-test-utils';
import {Switch} from 'fusion-plugin-react-router';
import * as React from 'react';

import type {ShallowWrapper} from 'enzyme';

// import Welcome from '../welcome';
import {Root} from '../root';
import loadApp from '../../test-utils/test-app';

test('Root renders', async () => {
  const app = await loadApp();
  const sim = getSimulator(app);
  const ctx = await sim.render('/');

  const root: ShallowWrapper<React.Component<*>> = ctx.rendered.find(Root);
  const switches: ShallowWrapper<React.Component<*>> = ctx.rendered.find(
    Switch
  );
  expect(root).toHaveLength(1);
  expect(switches).toHaveLength(1);
});
