import App from 'fusion-react';
import {createPlugin} from 'fusion-core';
import SomePlugin, {SomeToken} from '@uber/fusion-plugin-secure-headers';
import {OtherToken, OtherPlugin} from 'other-plugin';

console.log(App);

function thing() {
  const app = new App();
  if (__BROWSER__) {
    app.register(OtherToken, OtherPlugin);
  }
  if (__NODE__) {
    app.register(SomeToken, SomePlugin);
  }
  return app;
}
