import IsoRender from '@uber/isorender';
import Logger from '@uber/bedrock/universal-logger';
import i18n from '@uber/bedrock/isomorphic-i18n';
import M3 from '@uber/bedrock/universal-m3';
import createStore from '../../shared/store';
import getRoutes from '../../shared/components/routes';
import Root from '../../shared/components/root';

import initWebRpc from '../rpc';

/* istanbul ignore next */
// comes with scaffold for isomorphic rendering
function boostrapIsoRender(server) {
  // Initialize WebRPC, see ./rpc.js
  const webRpc = initWebRpc(server);
  // Initialize isomorphic rendered request handler
  const hydrate = (...args) => webRpc.hydrate(...args);
  const rootContainer = Root;
  return new IsoRender({
    routes: getRoutes(),
    rootContainer,
    hydrate,
    createStore,
    i18n,
    logger: Logger.createChild('isorender'),
    m3Client: M3,
    perf: {enabled: true},
  });
}

export default function setRoutes(server) {
  // health check, no middlewares (check middlewares.js)
  server.get('health', '/health', (req, res) => res.end('OK'));

  const isorender = boostrapIsoRender(server);

  // rendering routes
  server.get('SPA', '/*', (req, res) => boostrapIsoRender(server));
}
