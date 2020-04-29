// @flow
import {renderToStaticMarkup} from 'react-dom/server';
import {render} from '@testing-library/react';
import {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {TracerToken} from '@uber/fusion-plugin-tracer';

import getApp from '../main';

const defaultRender = __NODE__ ? renderToStaticMarkup : render;

export default async function start({render = defaultRender, root}: * = {}) {
  // eslint-disable-next-line
  const app = await getApp({render, root});

  if (__NODE__) {
    // $FlowFixMe mock it out
    app.register(TChannelToken, {});
    !__DEV__ && app.register(TracerToken, {});
  }
  return app;
}
