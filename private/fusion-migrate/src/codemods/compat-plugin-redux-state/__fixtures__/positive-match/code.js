import App from 'fusion-react';
import {SomeToken, SomePlugin} from 'some-plugin';
import ReduxPlugin, {ReduxToken} from 'fusion-plugin-react-redux';

console.log(App);

function thing() {
  const app = new App();
  console.log();
  app.register(SomeToken, SomePlugin);
  if (__NODE__) {
    app.register(ReduxToken, ReduxPlugin);
  }
  return app;
}
