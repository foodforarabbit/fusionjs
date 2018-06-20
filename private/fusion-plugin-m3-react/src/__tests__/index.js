// @flow
/* eslint-env browser */
import App, {ProviderPlugin} from 'fusion-react';
import {getSimulator} from 'fusion-test-utils';
import {mock as mockM3Plugin} from '@uber/fusion-plugin-m3';
import React from 'react';
import test from 'tape-cup';

import {M3Token} from '../index';
import withM3 from '../hoc';

if (__BROWSER__) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body && document.body.appendChild(root);
}

test('HOC', async t => {
  let didRender = false;
  class Test extends React.Component<{m3: typeof mockM3Plugin}> {
    render() {
      t.equal(typeof this.props.m3, 'object', 'M3 is correctly provided');
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
  t.ok(
    __NODE__
      ? res.body.includes('hello')
      : document.body && document.body.innerHTML.includes('hello'),
    'Test content rendered correctly'
  );
  t.ok(didRender, 'Test component rendered');
  t.end();
});
