import App from 'fusion-react';
import {createToken, createPlugin} from 'fusion-core';
import {SomeToken, SomePlugin} from 'some-plugin';

console.log(App);

function thing() {
  const app = new App();
  app.register(SomeToken, SomePlugin);
  return app;
}
