// @flow

/* eslint-env browser */
import App, {ProviderPlugin} from 'fusion-react';
import {getSimulator} from 'fusion-test-utils';
import {mock as mockLogtronPlugin} from '@uber/fusion-plugin-logtron';
import React from 'react';
import test from 'tape-cup';

import {LoggerToken} from 'fusion-tokens';

import withLogtron from '../hoc';

if (__BROWSER__) {
  const root = document.createElement('div');
  root.id = 'root';
  if (document.body && root instanceof HTMLElement) {
    document.body.appendChild(root);
  }
}

test('HOC', async t => {
  let didRender = false;
  type Props = {
    logger: any,
  };
  class Test extends React.Component<Props> {
    render() {
      t.equal(
        typeof this.props.logger,
        'object',
        'Logtron is correctly provided'
      );
      didRender = true;
      return React.createElement('div', null, 'hello');
    }
  }
  const Root = withLogtron(Test);
  const app = new App(React.createElement(Root));
  app.register(LoggerToken, ProviderPlugin.create('logger', mockLogtronPlugin));
  const sim = getSimulator(app);
  const res = await sim.render('/');
  t.ok(
    __NODE__
      ? String(res.body).includes('hello')
      : document.body && document.body.innerHTML.includes('hello'),
    'Test content rendered correctly'
  );
  t.ok(didRender, 'Test component rendered');
  t.end();
});