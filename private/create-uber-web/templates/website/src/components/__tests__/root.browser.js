// @flow

import {test, getSimulator} from 'fusion-test-utils';
import {Switch} from 'fusion-plugin-react-router';

import type {ShallowWrapper} from 'enzyme';

// import Welcome from '../welcome';
import {Root} from '../root';
import loadApp from '../../test-utils/test-app';

test('Root renders', async assert => {
  const app = await loadApp();
  const sim = getSimulator(app);
  const ctx = await sim.render('/');

  const root: ShallowWrapper = ctx.rendered.find(Root);
  const switches: ShallowWrapper = ctx.rendered.find(Switch);
  assert.equal(root.length, 1, 'has a root component');
  assert.equal(switches.length, 1, 'has one switch component');
});
