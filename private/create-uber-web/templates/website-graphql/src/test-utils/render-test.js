// @flow
import App, {ApolloClientToken} from 'fusion-apollo';
import type {Element} from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {HydrationStateToken} from 'fusion-plugin-i18n-react';
import type {ReactWrapper} from 'enzyme';

import initUI from '../uber/ui';
import {getSimulator} from 'fusion-test-utils';
import initI18n from '../uber/i18n';

Enzyme.configure({adapter: new Adapter()});

export default async function renderTest(
  root: Element<*>,
  url: ?string
): Promise<ReactWrapper> {
  const app = new App(root, mount);
  initUI(app);
  initI18n(app);
  if (__BROWSER__) {
    app.register(HydrationStateToken, {chunks: [], translations: {}});
    // $FlowFixMe
    app.register(ApolloClientToken, () => ({}));
  }
  const simulator = getSimulator(app);
  const ctx = await simulator.render(url || '/');
  return ctx.rendered;
}
