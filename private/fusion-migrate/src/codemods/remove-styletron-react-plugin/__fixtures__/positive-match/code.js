import App from 'fusion-react';
import StyletronPlugin from 'fusion-plugin-styletron-react';

export default function start() {
  const app = new App();
  app.register(StyletronPlugin);
  return app;
}
