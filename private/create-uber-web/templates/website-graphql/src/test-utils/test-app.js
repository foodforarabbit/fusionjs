// @flow
import type FusionApp from 'fusion-core';
import {renderToStaticMarkup} from 'react-dom/server';
import type {Element} from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {HydrationStateToken} from 'fusion-plugin-i18n-react';
import {GalileoConfigToken} from '@uber/fusion-plugin-galileo';
import {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {createPlugin} from 'fusion-core';

import getApp from '../main';
import {getDataFromTree} from 'react-apollo';
import {GraphQLDevToken} from '@uber/graphql-scripts';

const serverRender = el =>
  getDataFromTree(el).then(() => renderToStaticMarkup(el));

const render = __NODE__ ? serverRender : el => Promise.resolve(mount(el));

Enzyme.configure({adapter: new Adapter()});

export default async function start(root?: Element<*>): Promise<FusionApp> {
  const app = await getApp(root, render);
  if (__NODE__) {
    // $FlowFixMe mock it out
    app.register(TChannelToken, {});
    app.register(GraphQLDevToken, createPlugin({}));
    !__DEV__ &&
      app.register(GalileoConfigToken, {
        enabled: false,
      });
    !__DEV__ && app.register(TracerToken, {});
  } else {
    app.register(HydrationStateToken, {chunks: [], translations: {}});
  }
  return app;
}
