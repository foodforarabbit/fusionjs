import App from 'fusion-react';

const team = '';

export default (async function start(options: any = {}) {
  const root = options.root || DefaultRoot;
  const app = new App(root, options.render);
  return app;
});
