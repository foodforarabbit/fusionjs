// @flow
/* eslint-env browser */
import * as React from 'react';
import test from 'tape-cup';

import App from 'fusion-react';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';

import plugin from '../plugin.js';
import {TealiumToken, TealiumConfigToken} from '../index.js';
import withTealium from '../hoc.js';

if (__BROWSER__) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body && document.body.appendChild(root);
}

test('HOC', async t => {
  let didRender = false;
  class Test extends React.Component<any, any> {
    render() {
      if (__BROWSER__) {
        t.equal(
          typeof this.props.tealium,
          'object',
          'Tealium is correctly provided'
        );
      }

      didRender = true;
      return React.createElement('div', null, 'hello');
    }
  }

  const mockLogger = {
    log: () => mockLogger,
    error: () => mockLogger,
    warn: () => mockLogger,
    info: () => mockLogger,
    verbose: () => mockLogger,
    debug: () => mockLogger,
    silly: () => mockLogger,
  };

  const Root = withTealium(Test);
  const app = new App(React.createElement(Root));
  app.register(TealiumToken, plugin);
  __NODE__ && app.register(LoggerToken, mockLogger);
  __NODE__ && app.register(TealiumConfigToken, {});
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
