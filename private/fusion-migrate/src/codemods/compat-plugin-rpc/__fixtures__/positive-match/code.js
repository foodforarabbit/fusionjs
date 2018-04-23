import App from 'fusion-react';
import {SomeToken, SomePlugin} from 'some-plugin';

console.log(App);

function thing() {
  const app = new App();
  app.register(SomeToken, SomePlugin);
  return app;
}
