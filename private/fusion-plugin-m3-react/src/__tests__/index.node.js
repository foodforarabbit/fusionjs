// @flow
import App, {ProviderPlugin} from 'fusion-react';
import {getSimulator} from 'fusion-test-utils';
import {mock as mockM3Plugin} from '@uber/fusion-plugin-m3';
import React from 'react';

import {M3Token} from '../index';
import withM3 from '../hoc';

test('HOC', async () => {
  let didRender = false;
  class Test extends React.Component<{m3: typeof mockM3Plugin}> {
    render() {
      expect(typeof this.props.m3).toBe('object');
      didRender = true;
      return React.createElement('div', null, 'hello');
    }
  }
  const Root = withM3(Test);
  const app = new App(React.createElement(Root));
  // $FlowFixMe
  app.register(M3Token, ProviderPlugin.create('m3', mockM3Plugin));
  const sim = getSimulator(app);
  const res = await sim.render('/');
  expect(
    __NODE__
      ? String(res.body).includes('hello')
      : document.body && document.body.innerHTML.includes('hello')
  ).toBeTruthy();
  expect(didRender).toBeTruthy();
});
