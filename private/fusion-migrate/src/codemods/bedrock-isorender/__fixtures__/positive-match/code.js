/* globals setTimeout */
import IsoRender from '@uber/isorender';
import Logger from '@uber/fusion-plugin-universal-logger-compat';

import M3 from '@uber/fusion-plugin-universal-m3-compat';

import createStore from '../shared/store';
import routes from '../shared/components/routes';
import Root from '../shared/components/root';
import initWebRpc from './rpc';

export default function setRoutes(server) {
  server.get('health', '/health', (req, res) => res.end('OK'));

  server.get('trigger-error', '/trigger-error', (req, res) => {
    server.clients.logger.error('Testing an error');
    res.end();
  });

  const webRpc = initWebRpc(server);

  const hydrate = (...args) => webRpc.hydrate(...args);
  const rootContainer = Root;
  const isorender = new IsoRender({
    routes,
    rootContainer,
    hydrate,
    createStore,
    logger: Logger.createChild('isorender'),
    m3Client: M3,
    perf: {enabled: true},
  });

  server.get('SPA', '/*', (req, res) => isorender.handleRequest(req, res));
}
