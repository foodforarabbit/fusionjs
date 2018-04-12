import App from 'fusion-react';
import {createPlugin} from 'fusion-core';
import {SomeToken, SomePlugin} from 'some-plugin';
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
