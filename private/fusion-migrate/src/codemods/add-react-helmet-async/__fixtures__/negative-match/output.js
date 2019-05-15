import App from 'fusion-react';
import HelmetPlugin from 'fusion-plugin-react-helmet-async';
export default function start() {
  const app = new App();
  app.register(HelmetPlugin);
  return app;
}
