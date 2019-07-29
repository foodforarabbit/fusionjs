// @flow
import {ApolloClientToken, ApolloRenderEnhancer} from 'fusion-plugin-apollo';
import type {Element} from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import type {ReactWrapper} from 'enzyme';

import initUI from '../uber/ui';
import {getSimulator} from 'fusion-test-utils';

import App from 'fusion-react';
import {RenderToken} from 'fusion-core';

Enzyme.configure({adapter: new Adapter()});

export default async function renderTest(
  root: Element<*>,
  url: ?string
): Promise<ReactWrapper> {
  const app = new App(root, mount);
  app.enhance(RenderToken, ApolloRenderEnhancer);
  initUI(app);
  if (__BROWSER__) {
    // $FlowFixMe
    app.register(ApolloClientToken, () => ({}));
  }
  const simulator = getSimulator(app);
  const ctx = await simulator.render(url || '/');
  return ctx.rendered;
}
