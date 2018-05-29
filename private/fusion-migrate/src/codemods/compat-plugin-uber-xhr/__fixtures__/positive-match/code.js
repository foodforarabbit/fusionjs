import App from 'fusion-react';
import {SomeToken, SomePlugin} from 'some-plugin';

console.log(App);

function thing() {
  const app = new App();
  app.register(SomeToken, SomePlugin);
  if (lol) {
    console.log('lol');
  }
  if (__NODE__) {
    console.log('NODE');
  } else {
    console.log('BROWSER');
  }
  return app;
}
