// @flow
/* eslint-env browser */
import App from 'fusion-react';
import {getSimulator} from 'fusion-test-utils';
import React from 'react';

import plugin from '../src/plugin';
import {GoogleAnalyticsToken, GoogleAnalyticsConfigToken} from '../src/index';
import withGoogleAnalytics from '../src/hoc';

if (__BROWSER__) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body && document.body.appendChild(root);
}

test('HOC', async () => {
  let didRender = false;
  class Test extends React.Component<any> {
    render() {
      if (__BROWSER__) {
        expect(typeof this.props.googleAnalytics).toBe('object');
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
  expect(
    __NODE__
      ? String(res.body).includes('hello')
      : document.body && document.body.innerHTML.includes('hello')
  ).toBeTruthy();
  expect(didRender).toBeTruthy();
});
