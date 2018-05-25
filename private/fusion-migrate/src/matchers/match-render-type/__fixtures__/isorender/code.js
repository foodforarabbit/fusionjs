/* globals setTimeout */
import IsoRender from '@uber/isorender';

export default function setRoutes(server) {
  server.get('health', '/health', (req, res) => res.end('OK'));
  const isorender = new IsoRender({});
  server.get('SPA', '/*', (req, res) => isorender.handleRequest(req, res));
}
