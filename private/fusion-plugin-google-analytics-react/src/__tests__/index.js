// @flow
/* eslint-env browser */
import App from 'fusion-react';
import {getSimulator} from 'fusion-test-utils';
import React from 'react';
import test from 'tape-cup';

import plugin from '../plugin';
import {GoogleAnalyticsToken, GoogleAnalyticsConfigToken} from '../index';
import withGoogleAnalytics from '../hoc';

if (__BROWSER__) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

test('HOC', async t => {
  let didRender = false;
  class Test extends React.Component {
    render() {
      if (__BROWSER__) {
        t.equal(
          typeof this.props.googleAnalytics,
          'object',
          'Google Analytics is correctly provided'
        );
      }
      didRender = true;
      return React.createElement('div', null, 'hello');
    }
  }
  const Root = withGoogleAnalytics(Test);
  const app = new App(React.createElement(Root));
  app.register(GoogleAnalyticsToken, plugin);
  if (__BROWSER__) {
    app.register(GoogleAnalyticsConfigToken, {
      trackingId: 'test-id',
    });
  }

  const sim = getSimulator(app);
  const res = await sim.render('/');
  t.ok(
    __NODE__
      ? res.body.includes('hello')
      : document.body.innerHTML.includes('hello'),
    'Test content rendered correctly'
  );
  t.ok(didRender, 'Test component rendered');
  t.end();
});
