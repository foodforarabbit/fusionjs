/* globals setTimeout */
import renderPageSkeleton from '@uber/render-page-skeleton';

function handler(req, res) {
  console.log('hello');
  return renderPageSkeleton(res, {});
}

export default function setRoutes(server) {
  server.get('health', '/health', (req, res) => res.end('OK'));

  server.get('trigger-error', '/trigger-error', (req, res) => {
    server.clients.logger.error('Testing an error');
    res.end();
  });

  server.get('SPA', '/*', handler);
}