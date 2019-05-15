import App from 'fusion-react';
import HeatpipePlugin, { HeatpipeToken } from '@uber/fusion-plugin-heatpipe';
export default function start() {
  const app = new App();
  app.register(HeatpipeToken, HeatpipePlugin);
  return app;
}
