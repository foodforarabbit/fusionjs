import renderPageSkeleton from '@uber/render-page-skeleton';

export default function setRoutes(server) {
  server.get('health', '/health', (req, res) => res.end('OK'));
  server.get('SPA', '/*', (req, res) =>
    renderPageSkeleton(res, {
      useMagellan: true,
    })
  );
}
